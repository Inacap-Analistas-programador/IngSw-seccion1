import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from usuarios.models import Usuario
from personas.models import Persona, PersonaCurso
from cursos.models import Curso
from maestros.models import ConceptoContable, Perfil, TipoCurso, Cargo, EstadoCivil, Rol, Alimentacion
from geografia.models import Region, Provincia, Comuna
from pagos.models import PagoPersona, ComprobantePago, PagoComprobante
from django.utils import timezone
from decimal import Decimal

@pytest.mark.django_db
class TestPagosBackend:
    def setup_method(self):
        self.client = APIClient()
        
        # Create Perfil
        self.perfil = Perfil.objects.create(
            pel_descripcion='Administrador',
            pel_vigente=True
        )
        
        # Create User
        self.usuario = Usuario.objects.create(
            usu_username='testuser',
            usu_email='test@example.com',
            usu_password='password123',
            usu_vigente=True,
            pel_id=self.perfil
        )
        self.client.force_authenticate(user=self.usuario)
        
        # Create Geography
        self.region = Region.objects.create(reg_descripcion='Region Test', reg_vigente=True)
        self.provincia = Provincia.objects.create(pro_descripcion='Provincia Test', reg_id=self.region, pro_vigente=True)
        self.comuna = Comuna.objects.create(com_descripcion='Comuna Test', pro_id=self.provincia, com_vigente=True)
        
        # Create EstadoCivil
        self.estado_civil = EstadoCivil.objects.create(esc_descripcion='Soltero', esc_vigente=True)
        
        # Create Rol
        self.rol = Rol.objects.create(rol_descripcion='Estudiante', rol_tipo=1, rol_vigente=True)
        
        # Create Alimentacion
        self.alimentacion = Alimentacion.objects.create(ali_descripcion='Normal', ali_tipo=1, ali_vigente=True)
        
        # Create Persona (for responsible and payer)
        self.persona = Persona.objects.create(
            per_run=12345678, # Integer
            per_dv='9',
            per_nombres='Juan',
            per_apelpat='Perez',
            per_email='juan@test.com',
            per_fecha_nac=timezone.now().date(),
            esc_id=self.estado_civil,
            com_id=self.comuna,
            usu_id=self.usuario,
            per_direccion='Calle Falsa 123',
            per_tipo_fono=1,
            per_fono='912345678',
            per_apodo='Juancho',
            per_vigente=True
        )

        # Create TipoCurso
        self.tipo_curso = TipoCurso.objects.create(
            tcu_descripcion='Tipo Test',
            tcu_tipo=1,
            tcu_vigente=True
        )

        # Create Cargo
        self.cargo = Cargo.objects.create(
            car_descripcion='Cargo Test',
            car_vigente=True
        )
        
        # Create Curso
        self.curso = Curso.objects.create(
            cur_codigo='C001',
            cur_descripcion='Curso Test',
            cur_estado=1,
            usu_id=self.usuario,
            tcu_id=self.tipo_curso,
            per_id_responsable=self.persona,
            car_id_responsable=self.cargo,
            cur_administra=1,
            cur_cuota_con_almuerzo=10000,
            cur_cuota_sin_almuerzo=8000,
            cur_modalidad=1,
            cur_tipo_curso=1,
            cur_fecha_solicitud=timezone.now()
        )

        # Create CursoSeccion FIRST because PersonaCurso needs it
        from cursos.models import CursoSeccion
        self.curso_seccion = CursoSeccion.objects.create(
            cur_id=self.curso,
            cus_seccion=1,
            cus_cant_participante=30
        )

        # Create PersonaCurso
        self.persona_curso = PersonaCurso.objects.create(
            per_id=self.persona,
            cus_id=self.curso_seccion,
            rol_id=self.rol,
            ali_id=self.alimentacion,
            pec_registro=True,
            pec_acreditado=True
        )
        
        # Create Concepto
        self.concepto = ConceptoContable.objects.create(
            coc_descripcion='Mensualidad',
            coc_vigente=True
        )

    def test_manual_creation_debug(self):
        """Debug manual creation of PagoPersona"""
        try:
            PagoPersona.objects.create(
                per_id=self.persona,
                cur_id=self.curso,
                usu_id=self.usuario,
                pap_tipo=1,
                pap_valor=5000,
                pap_observacion='Manual test',
                pap_fecha_hora=timezone.now()
            )
        except Exception as e:
            pytest.fail(f"Manual creation failed: {e}")

    def test_create_payment_with_file_and_voucher(self):
        """Test creating a payment with a file upload generates a ComprobantePago"""
        url = reverse('pagopersona-list')
        
        # Create a dummy file
        file_content = b'dummy content'
        file = SimpleUploadedFile("test_receipt.jpg", file_content, content_type="image/jpeg")
        
        data = {
            'per_id': self.persona.per_id,
            'cur_id': self.curso.cur_id,
            'usu_id': self.usuario.usu_id,
            'pap_tipo': 1, # Ingreso
            'pap_valor': 5000,
            'pap_observacion': 'Pago con foto',
            'pap_fecha_hora': timezone.now(),
            'coc_id': self.concepto.coc_id,
            'file': file
        }
        
        response = self.client.post(url, data, format='multipart')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert PagoPersona.objects.count() == 1
        assert ComprobantePago.objects.count() == 1
        assert PagoComprobante.objects.count() == 1
        
        payment = PagoPersona.objects.first()
        comprobante = ComprobantePago.objects.first()
        
        assert payment.pap_valor == 5000
        assert comprobante.cpa_valor == 5000
        assert comprobante.coc_id == self.concepto
        assert 'test_receipt' in comprobante.cpa_archivo.name

    def test_mass_payment_group(self):
        """Test mass payment registration for a group"""
        url = reverse('pagopersona-registro-masivo')
        
        # Create another persona
        persona2 = Persona.objects.create(
            per_run=87654321, per_dv='0', per_nombres='Maria', per_apelpat='Gomez',
            per_fecha_nac=timezone.now().date(),
            esc_id=self.estado_civil,
            com_id=self.comuna,
            usu_id=self.usuario,
            per_direccion='Calle Falsa 123',
            per_tipo_fono=1,
            per_fono='912345678',
            per_apodo='Maria',
            per_vigente=True
        )
        
        # Link persona2 to course
        PersonaCurso.objects.create(
            per_id=persona2,
            cus_id=self.curso_seccion,
            rol_id=self.rol,
            ali_id=self.alimentacion,
            pec_registro=True,
            pec_acreditado=True
        )
        
        data = {
            'cur_id': self.curso.cur_id,
            'personas': [self.persona.per_id, persona2.per_id],
            'valor_unitario': 10000,
            'pap_tipo': 1,
            'usu_id': self.usuario.usu_id
        }
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['created_count'] == 2
        assert PagoPersona.objects.count() == 2
        
        for pago in PagoPersona.objects.all():
            assert pago.pap_valor == 10000

    def test_multi_person_payment(self):
        """Test multi-person payment from a single payer"""
        url = reverse('pagopersona-registro-multi-persona')
        
        persona2 = Persona.objects.create(
            per_run=99999999, per_dv='K', per_nombres='Pedro', per_apelpat='Diaz',
            per_fecha_nac=timezone.now().date(),
            esc_id=self.estado_civil,
            com_id=self.comuna,
            usu_id=self.usuario,
            per_direccion='Calle Falsa 123',
            per_tipo_fono=1,
            per_fono='912345678',
            per_apodo='Pedro',
            per_vigente=True
        )

        # Link persona2 to course
        PersonaCurso.objects.create(
            per_id=persona2,
            cus_id=self.curso_seccion,
            rol_id=self.rol,
            ali_id=self.alimentacion,
            pec_registro=True,
            pec_acreditado=True
        )
        
        data = {
            'payer_id': self.persona.per_id,
            'cur_id': self.curso.cur_id,
            'payments': [
                {'per_id': self.persona.per_id, 'amount': 5000},
                {'per_id': persona2.per_id, 'amount': 7000}
            ],
            'pap_tipo': 1,
            'observacion': 'Pago multiple',
            'usu_id': self.usuario.usu_id
        }
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['created_count'] == 2
        
        p1 = PagoPersona.objects.get(per_id=self.persona)
        p2 = PagoPersona.objects.get(per_id=persona2)
        
        assert p1.pap_valor == 5000
        assert p2.pap_valor == 7000
        assert "Pagado por ID" in p2.pap_observacion
