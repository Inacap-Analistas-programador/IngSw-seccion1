from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from usuarios.models import Usuario
from maestros.models import Perfil, ConceptoContable, TipoCurso, Cargo, EstadoCivil, Rol, Alimentacion
from geografia.models import Region, Provincia, Comuna
from personas.models import Persona, PersonaCurso
from cursos.models import Curso, CursoSeccion
from pagos.models import PagoPersona
from proveedores.models import Proveedor
from django.utils import timezone
from decimal import Decimal
from datetime import date

class FunctionalQATestCase(APITestCase):
    def setUp(self):
        # 1. Setup User and Auth
        self.perfil = Perfil.objects.create(pel_descripcion='Administrador', pel_vigente=True)
        self.usuario = Usuario.objects.create(
            pel_id=self.perfil,
            usu_username='admin_qa',
            usu_email='admin_qa@test.com',
            usu_password='hashed_password',
            usu_vigente=True
        )
        self.client.force_authenticate(user=self.usuario)

        # 2. Setup Dependencies
        self.region = Region.objects.create(reg_descripcion='Metropolitana', reg_vigente=True)
        self.provincia = Provincia.objects.create(pro_descripcion='Santiago', reg_id=self.region, pro_vigente=True)
        self.comuna = Comuna.objects.create(com_descripcion='Santiago', pro_id=self.provincia, com_vigente=True)
        self.estado_civil = EstadoCivil.objects.create(esc_descripcion='Soltero', esc_vigente=True)
        self.tipo_curso = TipoCurso.objects.create(tcu_descripcion='Presencial', tcu_tipo=1, tcu_vigente=True)
        self.cargo = Cargo.objects.create(car_descripcion='Coordinador', car_vigente=True)
        self.rol = Rol.objects.create(rol_descripcion='Participante', rol_tipo=1, rol_vigente=True)
        self.alimentacion = Alimentacion.objects.create(ali_descripcion='Normal', ali_tipo=1, ali_vigente=True)

        # 3. Setup Responsable for Curso
        self.responsable = Persona.objects.create(
            per_run=99999999,
            per_dv='9',
            per_nombres='Responsable',
            per_apelpat='Curso',
            per_email='resp@curso.com',
            per_vigente=True,
            esc_id=self.estado_civil,
            com_id=self.comuna,
            usu_id=self.usuario,
            per_fecha_nac=date(1980, 1, 1),
            per_direccion='Direccion Falsa 123',
            per_tipo_fono=1,
            per_fono='912345678',
            per_apodo='Resp'
        )

        # 4. Setup Curso
        self.curso = Curso.objects.create(
            cur_codigo='CUR-001',
            cur_descripcion='Curso QA',
            usu_id=self.usuario,
            tcu_id=self.tipo_curso,
            per_id_responsable=self.responsable,
            car_id_responsable=self.cargo,
            cur_fecha_solicitud=timezone.now(),
            cur_administra=1,
            cur_cuota_con_almuerzo=50000,
            cur_cuota_sin_almuerzo=45000,
            cur_modalidad=1,
            cur_tipo_curso=1,
            cur_estado=1
        )

        # 5. Setup Student Persona
        self.persona = Persona.objects.create(
            per_run=11111111,
            per_dv='1',
            per_nombres='Juan',
            per_apelpat='Perez',
            per_email='juan@test.com',
            per_vigente=True,
            esc_id=self.estado_civil,
            com_id=self.comuna,
            usu_id=self.usuario,
            per_fecha_nac=date(2000, 1, 1),
            per_direccion='Calle Falsa 123',
            per_tipo_fono=1,
            per_fono='912345678',
            per_apodo='Estudiante'
        )
        
        # 6. Setup CursoSeccion and PersonaCurso (Enrollment)
        self.seccion = CursoSeccion.objects.create(
            cur_id=self.curso,
            cus_seccion=1,
            cus_cant_participante=30
        )
        
        self.matricula = PersonaCurso.objects.create(
            per_id=self.persona,
            cus_id=self.seccion,
            rol_id=self.rol,
            ali_id=self.alimentacion,
            pec_registro=True,
            pec_acreditado=False
        )
        
        self.concepto = ConceptoContable.objects.create(coc_descripcion='Mensualidad', coc_vigente=True)

    def test_GP01_registro_ingreso_simple(self):
        """
        GP-01: Registro de Ingreso Simple
        Verifica que se pueda registrar un pago correctamente.
        """
        url = '/api/pagos/pagopersonas/'
        data = {
            'per_id': self.persona.per_id,
            'cur_id': self.curso.cur_id,
            'usu_id': self.usuario.usu_id,
            'pap_fecha_hora': timezone.now(),
            'pap_tipo': 1, # Ingreso
            'pap_valor': 50000,
            'pap_estado': 1, # Pagado
            'pap_observacion': 'Pago de prueba QA'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PagoPersona.objects.count(), 1)
        self.assertEqual(PagoPersona.objects.get().pap_valor, 50000)

    def test_GP02_validacion_montos_negativos(self):
        """
        GP-02: Validación de Montos Negativos
        Verifica que el sistema rechace pagos con montos negativos o cero.
        """
        url = '/api/pagos/pagopersonas/'
        data = {
            'per_id': self.persona.per_id,
            'cur_id': self.curso.cur_id,
            'usu_id': self.usuario.usu_id,
            'pap_fecha_hora': timezone.now(),
            'pap_tipo': 1,
            'pap_valor': -5000, # Negativo
            'pap_estado': 1
        }
        
        response = self.client.post(url, data, format='json')
        
        # Esperamos 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(PagoPersona.objects.count(), 0)

    def test_GP03_anulacion_pago(self):
        """
        GP-03: Anulación de Pago
        Verifica que se pueda cambiar el estado de un pago a Anulado.
        """
        # Crear pago inicial
        pago = PagoPersona.objects.create(
            per_id=self.persona,
            cur_id=self.curso,
            usu_id=self.usuario,
            pap_fecha_hora=timezone.now(),
            pap_tipo=1,
            pap_valor=50000,
            pap_estado=1
        )
        
        url = f'/api/pagos/pagopersonas/{pago.pap_id}/'
        data = {'pap_estado': 2} # 2 = Anulado
        
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        pago.refresh_from_db()
        self.assertEqual(pago.pap_estado, 2)

    def test_PM01_pago_masivo(self):
        """
        PM-01: Pago Masivo
        Verifica la creación de múltiples pagos a través del endpoint masivo.
        """
        # Crear otra persona para el pago masivo
        persona2 = Persona.objects.create(
            per_run=22222222,
            per_dv='2',
            per_nombres='Maria',
            per_apelpat='Gonzalez',
            per_email='maria@test.com',
            per_vigente=True,
            esc_id=self.estado_civil,
            com_id=self.comuna,
            usu_id=self.usuario,
            per_fecha_nac=date(2000, 1, 1),
            per_direccion='Calle Falsa 123',
            per_tipo_fono=1,
            per_fono='912345678'
        )
        
        # Inscribir a persona2 en el curso (sección)
        PersonaCurso.objects.create(
            per_id=persona2,
            cus_id=self.seccion,
            rol_id=self.rol,
            ali_id=self.alimentacion,
            pec_registro=True,
            pec_acreditado=False
        )
        
        url = '/api/pagos/pagopersonas/masivo/'
        data = {
            'valor_total': 100000,
            'valor_unitario': 50000,
            'personas': [self.persona.per_id, persona2.per_id],
            'cur_id': self.curso.cur_id,
            'pap_tipo': 1,
            'pap_observacion': 'Pago Masivo QA',
            'usu_id': self.usuario.usu_id
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PagoPersona.objects.count(), 2)
        
        # Verificar que ambos pagos tengan el monto correcto
        pagos = PagoPersona.objects.all()
        for pago in pagos:
            self.assertEqual(pago.pap_valor, 50000)
            self.assertEqual(pago.pap_observacion, 'Registro masivo: 100000 (valor por persona: 50000)')

    def test_PR01_validacion_proveedor(self):
        """
        PR-01: Validación de Proveedor
        Verifica que se pueda crear un proveedor correctamente.
        """
        url = '/api/proveedores/proveedores/'
        
        # Caso inválido: Falta campo requerido (prv_descripcion)
        data_invalid = {
            'prv_celular1': '99999999',
            'prv_direccion': 'Calle Falsa 123',
            'prv_vigente': True
        }
        response = self.client.post(url, data_invalid, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Caso válido
        data_valid = {
            'prv_descripcion': 'Proveedor Valido',
            'prv_celular1': '99999999',
            'prv_direccion': 'Calle Real 123',
            'prv_vigente': True
        }
        
        response = self.client.post(url, data_valid, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Proveedor.objects.count(), 1)

    def test_GP07_generacion_comprobante(self):
        """
        GP-07: Generación de Comprobante con Archivo
        Verifica que al subir un archivo junto con el pago, se cree el ComprobantePago asociado.
        """
        from django.core.files.uploadedfile import SimpleUploadedFile
        
        url = '/api/pagos/pagopersonas/'
        
        # Crear un archivo dummy
        file_content = b"dummy content"
        file = SimpleUploadedFile("comprobante.pdf", file_content, content_type="application/pdf")
        
        data = {
            'per_id': self.persona.per_id,
            'cur_id': self.curso.cur_id,
            'usu_id': self.usuario.usu_id,
            'pap_fecha_hora': timezone.now(),
            'pap_tipo': 1,
            'pap_valor': 15000,
            'pap_estado': 1,
            'coc_id': self.concepto.coc_id, # Requerido para generar comprobante
            'file': file
        }
        
        # Usamos multipart/form-data para subir archivos
        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verificar que se creó el pago
        self.assertEqual(PagoPersona.objects.count(), 1)
        pago = PagoPersona.objects.first()
        
        # Verificar que se creó el comprobante y la relación
        from pagos.models import ComprobantePago, PagoComprobante
        self.assertEqual(ComprobantePago.objects.count(), 1)
        self.assertEqual(PagoComprobante.objects.count(), 1)
        
        relacion = PagoComprobante.objects.first()
        self.assertEqual(relacion.pap_id, pago)
        self.assertTrue(relacion.cpa_id.cpa_archivo)

    def test_PR02_pago_proveedor(self):
        """
        PR-02: Registro de Pago a Proveedor
        Verifica el flujo completo de registrar un egreso hacia un proveedor.
        """
        # 1. Crear Proveedor
        proveedor = Proveedor.objects.create(
            prv_descripcion='Proveedor Insumos',
            prv_celular1='98765432',
            prv_direccion='Av. Industrial 555',
            prv_vigente=True
        )
        
        url = '/api/pagos/pagos-proveedores/'
        data = {
            'prv_id': proveedor.prv_id,
            'usu_id': self.usuario.usu_id,
            'coc_id': self.concepto.coc_id,
            'ppr_fecha': timezone.now().date(),
            'ppr_valor': 120000,
            'ppr_observacion': 'Compra de materiales'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        from pagos.models import PagoProveedor
        self.assertEqual(PagoProveedor.objects.count(), 1)
        pago_prov = PagoProveedor.objects.first()
        self.assertEqual(pago_prov.ppr_valor, 120000)
        self.assertEqual(pago_prov.prv_id, proveedor)

    def test_SEC01_acceso_denegado_anonimo(self):
        """
        SEC-01: Seguridad - Acceso Denegado
        Verifica que un usuario no autenticado no pueda registrar pagos.
        """
        self.client.logout() # Desloguear al usuario admin
        
        url = '/api/pagos/pagopersonas/'
        data = {
            'per_id': self.persona.per_id,
            'cur_id': self.curso.cur_id,
            'pap_valor': 5000
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

