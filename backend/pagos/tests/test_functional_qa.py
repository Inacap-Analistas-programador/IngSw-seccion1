from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from usuarios.models import Usuario
from maestros.models import Perfil, ConceptoContable
from personas.models import Persona, PersonaCurso
from cursos.models import Curso, CursoSeccion
from pagos.models import PagoPersona
from proveedores.models import Proveedor
from django.utils import timezone
from decimal import Decimal

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

        # 2. Setup Basic Data
        self.curso = Curso.objects.create(cur_descripcion='Curso QA', cur_vigente=True)
        self.persona = Persona.objects.create(
            per_run='11111111-1',
            per_nombres='Juan',
            per_apelpat='Perez',
            per_email='juan@test.com'
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
            per_run='22222222-2',
            per_nombres='Maria',
            per_apelpat='Gomez',
            per_email='maria@test.com'
        )
        
        url = '/api/pagos/pagopersonas/masivo/'
        data = {
            'valor_total': 100000,
            'valor_unitario': 50000,
            'personas': [self.persona.per_id, persona2.per_id],
            'cur_id': self.curso.cur_id,
            'pap_tipo': 1,
            'pap_observacion': 'Pago Masivo QA'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PagoPersona.objects.count(), 2)
        
        # Verificar que ambos pagos tengan el monto correcto
        pagos = PagoPersona.objects.all()
        for pago in pagos:
            self.assertEqual(pago.pap_valor, 50000)
            self.assertEqual(pago.pap_observacion, 'Pago Masivo QA')

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

