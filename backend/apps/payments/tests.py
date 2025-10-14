from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse 
from django.contrib.auth import get_user_model # se usará get_user_model para obtener el modelo de usuario aunque no se use directamente porque se usa en ForeignKey y no se puede usar settings.AUTH_USER_MODEL porque no existe
from datetime import date
from django.utils import timezone

from .models import (
    PagoPersona, PagoCambioPersona, Prepago, ComprobantePago, PagoComprobante, ConceptoContable
)

User = get_user_model()

class PaymentsAPITests(APITestCase):
    """
    Suite de pruebas para la API de la aplicación de Pagos.

    Esta clase contiene pruebas para todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
    de cada uno de los modelos de la aplicación de pagos. Se asegura de que los endpoints
    de la API se comporten como se espera, validen los datos correctamente y manejen
    la autenticación y los permisos de manera adecuada.
    """

    def setUp(self):
        """
        Configura el entorno inicial para cada prueba.

        Este método se ejecuta antes de cada método de prueba en esta clase. Se encarga de:
        1. Crear usuarios de prueba: uno estándar y uno administrador.
        2. Definir IDs de marcador de posición para las claves foráneas que aún no están implementadas.
        3. Crear instancias iniciales de cada modelo de la aplicación (ConceptoContable, PagoPersona, etc.)
           para que puedan ser utilizadas en las pruebas de lectura, actualización y eliminación.
        4. Almacenar las URLs de la API para cada endpoint, facilitando su uso en las pruebas.
        """
        # --- Creación de Usuarios ---
        # Se crea un usuario estándar para probar permisos de no-administrador.
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        # Se crea un superusuario para probar acciones que requieren privilegios de administrador (ej. eliminar).
        self.admin_user = User.objects.create_superuser(username='adminuser', email='admin@example.com', password='adminpassword')

        # --- IDs de Marcador de Posición ---
        # Como los modelos de Persona y Curso no están en esta aplicación, usamos IDs enteros simples
        # para simular las relaciones de clave foránea.
        self.dummy_persona_id = 1
        self.dummy_curso_id = 1
        self.dummy_persona_curso_id = 1

        # --- Creación de Instancia: ConceptoContable ---
        # Se crea un concepto contable inicial para usar en otras pruebas.
        self.concepto_contable = ConceptoContable.objects.create(
            COC_DESCRIPCION='Matrícula',
            COC_VIGENTE=True
        )
        # Se definen las URLs para la lista y el detalle del ConceptoContable.
        self.concepto_contable_url = reverse('payments:concepto-contable-list')
        self.concepto_contable_detail_url = lambda pk: reverse('payments:concepto-contable-detail', kwargs={'pk': pk})

        # --- Creación de Instancia: PagoPersona ---
        # Datos para crear un nuevo pago a través del serializer.
        self.pago_persona_data = {
            'PER_ID': self.dummy_persona_id,
            'CUR_ID': self.dummy_curso_id,
            # 'USU_ID' ya no se envía, se asigna automáticamente en la vista.
            'PAP_FECHA_HORA': timezone.now().isoformat(),
            'PAP_TIPO': 1, # Ingreso
            'PAP_VALOR': '100.00',
            'PAP_OBSERVACION': 'Pago de prueba'
        }
        self.pago_persona = PagoPersona.objects.create(
            PER_ID=self.dummy_persona_id,
            CUR_ID=self.dummy_curso_id,
            USU_ID=self.admin_user, # Los objetos iniciales son creados por el admin.
            PAP_FECHA_HORA=timezone.now(),
            PAP_TIPO=1,
            PAP_VALOR='100.00',
            PAP_OBSERVACION= 'Pago de prueba'
        )
        self.pago_persona_url = reverse('payments:pago-persona-list')
        self.pago_persona_detail_url = lambda pk: reverse('payments:pago-persona-detail', kwargs={'pk': pk})

        # --- Creación de Instancia: ComprobantePago ---
        self.comprobante_pago_data = {
            'PEC_ID': self.dummy_persona_curso_id,
            'COC_ID': self.concepto_contable.COC_ID,
            'CPA_FECHA': timezone.localdate().isoformat(),
            'CPA_NUMERO': 12345,
            # 'CPA_VALOR' se calcula automáticamente.
            'pagos_ids': [self.pago_persona.PAP_ID]
        }
        self.comprobante_pago = ComprobantePago.objects.create(
            USU_ID=self.admin_user,
            PEC_ID=self.dummy_persona_curso_id,
            COC_ID=self.concepto_contable,
            CPA_FECHA_HORA=timezone.now(),
            CPA_FECHA=timezone.localdate(),
            CPA_NUMERO=12345,
            CPA_VALOR='100.00'
        )
        self.comprobante_pago_url = reverse('payments:comprobante-pago-list')
        self.comprobante_pago_detail_url = lambda pk: reverse('payments:comprobante-pago-detail', kwargs={'pk': pk})

        # --- Creación de Instancia: PagoCambioPersona ---
        self.pago_cambio_persona_data = {
            'PER_ID': self.dummy_persona_id + 1,
            'PAP_ID': self.pago_persona.PAP_ID,
        }
        self.pago_cambio_persona = PagoCambioPersona.objects.create(
            PER_ID=self.dummy_persona_id + 1,
            PAP_ID=self.pago_persona,
            USU_ID=self.admin_user,
            PCP_FECHA_HORA=timezone.now(),
        )
        self.pago_cambio_persona_url = reverse('payments:pago-cambio-persona-list')
        self.pago_cambio_persona_detail_url = lambda pk: reverse('payments:pago-cambio-persona-detail', kwargs={'pk': pk})

        # --- Creación de Instancia: Prepago ---
        self.prepago_data = {
            'PER_ID': self.dummy_persona_id,
            'CUR_ID': self.dummy_curso_id,
            'PAP_ID': self.pago_persona.PAP_ID,
            'PPA_VALOR': '200.00',
            'PPA_OBSERVACION': 'Prepago de curso',
            'PPA_VIGENTE': True
        }
        self.prepago = Prepago.objects.create(
            PER_ID=self.dummy_persona_id,
            CUR_ID=self.dummy_curso_id,
            PAP_ID=self.pago_persona,
            PPA_VALOR='200.00',
            PPA_OBSERVACION='Prepago de curso',
            PPA_VIGENTE=True
        )
        self.prepago_url = reverse('payments:prepago-list')
        self.prepago_detail_url = lambda pk: reverse('payments:prepago-detail', kwargs={'pk': pk})

        # --- Creación de Instancia: PagoComprobante ---
        self.pago_comprobante_data = {
            'PAP_ID': self.pago_persona.PAP_ID,
            'CPA_ID': self.comprobante_pago.CPA_ID
        }
        self.pago_comprobante = PagoComprobante.objects.create(
            PAP_ID=self.pago_persona,
            CPA_ID=self.comprobante_pago
        )
        self.pago_comprobante_url = reverse('payments:pago-comprobante-list')
        self.pago_comprobante_detail_url = lambda pk: reverse('payments:pago-comprobante-detail', kwargs={'pk': pk})


    # --- Pruebas para ConceptoContable ---
    def test_list_conceptos_contables(self):
        """Prueba que un usuario autenticado pueda listar los conceptos contables."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.concepto_contable_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_concepto_contable(self):
        """Prueba que un administrador pueda crear un nuevo concepto contable."""
        self.client.force_authenticate(user=self.admin_user)
        new_data = {'COC_DESCRIPCION': 'Donación', 'COC_VIGENTE': True}
        response = self.client.post(self.concepto_contable_url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ConceptoContable.objects.count(), 2)

    def test_create_concepto_contable_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda crear un concepto contable."""
        self.client.force_authenticate(user=self.user)
        new_data = {'COC_DESCRIPCION': 'Donación', 'COC_VIGENTE': True}
        response = self.client.post(self.concepto_contable_url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_concepto_contable(self):
        """Prueba que un usuario autenticado pueda ver el detalle de un concepto contable."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.concepto_contable_detail_url(self.concepto_contable.COC_ID))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['COC_DESCRIPCION'], 'Matrícula')

    def test_update_concepto_contable_by_admin(self):
        """Prueba que un administrador pueda actualizar un concepto contable existente."""
        self.client.force_authenticate(user=self.admin_user)
        updated_data = {'COC_DESCRIPCION': 'Cuota Anual', 'COC_VIGENTE': False}
        response = self.client.put(self.concepto_contable_detail_url(self.concepto_contable.COC_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.concepto_contable.refresh_from_db()
        self.assertEqual(self.concepto_contable.COC_DESCRIPCION, 'Cuota Anual')

    def test_update_concepto_contable_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda actualizar un concepto contable."""
        self.client.force_authenticate(user=self.user)
        updated_data = {'COC_DESCRIPCION': 'Cuota Anual', 'COC_VIGENTE': False}
        response = self.client.put(self.concepto_contable_detail_url(self.concepto_contable.COC_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_concepto_contable_by_admin(self):
        """Prueba que un administrador pueda eliminar un concepto contable."""
        # Para evitar un ProtectedError, primero debemos eliminar los objetos
        # que dependen de este concepto contable. En este caso, el comprobante de pago.
        # También eliminamos el PagoComprobante que depende del comprobante.
        self.pago_comprobante.delete()
        self.comprobante_pago.delete()

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.concepto_contable_detail_url(self.concepto_contable.COC_ID))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ConceptoContable.objects.count(), 0)

    def test_delete_concepto_contable_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda eliminar un concepto contable."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.concepto_contable_detail_url(self.concepto_contable.COC_ID))
        # Esperamos un 403 porque el usuario no tiene permisos, incluso antes de llegar al ProtectedError.
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # --- Pruebas para PagoPersona ---
    def test_list_pagos_persona(self):
        """Prueba que un usuario autenticado pueda listar los pagos de personas."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.pago_persona_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_pago_persona_by_admin(self):
        """Prueba que un administrador pueda crear un nuevo pago de persona."""
        self.client.force_authenticate(user=self.admin_user)
        new_data = {
            'PER_ID': self.dummy_persona_id + 2,
            'CUR_ID': self.dummy_curso_id + 1,
            'PAP_TIPO': 1,
            'PAP_VALOR': '75.00',
            'PAP_OBSERVACION': 'Nuevo pago'
        }
        response = self.client.post(self.pago_persona_url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PagoPersona.objects.count(), 2)
        # Verifica que el usuario que creó el pago es el admin, asignado automáticamente.
        self.assertEqual(response.data['USU_ID'], self.admin_user.id)

    def test_create_pago_persona_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda crear un nuevo pago de persona."""
        self.client.force_authenticate(user=self.user)
        data = { 'PER_ID': 1, 'CUR_ID': 1, 'PAP_TIPO': 1, 'PAP_VALOR': '50.00' }
        response = self.client.post(self.pago_persona_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_pago_persona(self):
        """Prueba que un usuario autenticado pueda ver el detalle de un pago de persona."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.pago_persona_detail_url(self.pago_persona.PAP_ID))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['PAP_VALOR']), 100.00)

    def test_update_pago_persona_by_admin(self):
        """Prueba que un administrador pueda actualizar un pago de persona existente."""
        self.client.force_authenticate(user=self.admin_user)
        updated_data = { 'PER_ID': 1, 'CUR_ID': 1, 'PAP_TIPO': 1, 'PAP_VALOR': '120.00' }
        response = self.client.put(self.pago_persona_detail_url(self.pago_persona.PAP_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pago_persona.refresh_from_db()
        self.assertEqual(float(self.pago_persona.PAP_VALOR), 120.00)

    def test_update_pago_persona_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda actualizar un pago de persona."""
        self.client.force_authenticate(user=self.user)
        updated_data = {'PAP_VALOR': '120.00'}
        response = self.client.patch(self.pago_persona_detail_url(self.pago_persona.PAP_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_pago_persona_by_admin(self):
        """Prueba que un administrador pueda eliminar un pago de persona."""
        # Para evitar un ProtectedError, primero debemos eliminar los objetos
        # que tienen una FK protegida a self.pago_persona.
        self.pago_cambio_persona.delete()
        self.prepago.delete()
        self.pago_comprobante.delete()

        self.client.force_authenticate(user=self.admin_user)

        response = self.client.delete(self.pago_persona_detail_url(self.pago_persona.PAP_ID))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PagoPersona.objects.count(), 0)

    def test_delete_pago_persona_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda eliminar un pago de persona."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.pago_persona_detail_url(self.pago_persona.PAP_ID))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_pago_persona_invalid_valor(self):
        """Prueba que no se pueda crear un pago con un valor inválido (cero o negativo)."""
        self.client.force_authenticate(user=self.admin_user) # La creación requiere admin
        invalid_data = {'PER_ID': 1, 'CUR_ID': 1, 'PAP_TIPO': 1, 'PAP_VALOR': '0.00'}
        response = self.client.post(self.pago_persona_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Ajustamos la aserción para que funcione con un manejador de excepciones personalizado
        # que envuelve los errores en una clave 'details'.
        self.assertIn('details', response.data)
        self.assertEqual(str(response.data['details']['PAP_VALOR'][0]), 'El valor del pago debe ser mayor a 0.')
    # --- Pruebas para PagoCambioPersona ---
    def test_list_pagos_cambio_persona(self):
        """Prueba que un usuario autenticado pueda listar el historial de cambios de pago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.pago_cambio_persona_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_pago_cambio_persona_by_admin(self):
        """Prueba que un administrador pueda crear un nuevo registro de cambio de pago."""
        self.client.force_authenticate(user=self.admin_user)
        new_data = {
            'PER_ID': self.dummy_persona_id + 3,
            'PAP_ID': self.pago_persona.PAP_ID,
        }
        response = self.client.post(self.pago_cambio_persona_url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PagoCambioPersona.objects.count(), 2)
        self.assertEqual(response.data['USU_ID'], self.admin_user.id)

    def test_create_pago_cambio_persona_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda crear un registro de cambio de pago."""
        self.client.force_authenticate(user=self.user)
        new_data = {'PER_ID': self.dummy_persona_id + 3, 'PAP_ID': self.pago_persona.PAP_ID}
        response = self.client.post(self.pago_cambio_persona_url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_retrieve_pago_cambio_persona(self):
        """Prueba que un usuario autenticado pueda ver el detalle de un cambio de pago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.pago_cambio_persona_detail_url(self.pago_cambio_persona.PCP_ID))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['PER_ID'], self.dummy_persona_id + 1)

    def test_update_pago_cambio_persona_by_admin(self):
        """Prueba que un administrador pueda actualizar un registro de cambio de pago."""
        self.client.force_authenticate(user=self.admin_user)
        updated_data = {'PER_ID': self.dummy_persona_id + 4, 'PAP_ID': self.pago_persona.PAP_ID}
        response = self.client.put(self.pago_cambio_persona_detail_url(self.pago_cambio_persona.PCP_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pago_cambio_persona.refresh_from_db()
        self.assertEqual(self.pago_cambio_persona.PER_ID, self.dummy_persona_id + 4)

    def test_update_pago_cambio_persona_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda actualizar un registro de cambio de pago."""
        self.client.force_authenticate(user=self.user)
        updated_data = {'PER_ID': self.dummy_persona_id + 4}
        response = self.client.patch(self.pago_cambio_persona_detail_url(self.pago_cambio_persona.PCP_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_pago_cambio_persona_by_admin(self):
        """Prueba que un administrador pueda eliminar un registro de cambio de pago."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.pago_cambio_persona_detail_url(self.pago_cambio_persona.PCP_ID))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PagoCambioPersona.objects.count(), 0)

    def test_delete_pago_cambio_persona_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda eliminar un registro de cambio de pago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.pago_cambio_persona_detail_url(self.pago_cambio_persona.PCP_ID))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # --- Pruebas para Prepago ---
    def test_list_prepagos(self):
        """Prueba que un usuario autenticado pueda listar los prepagos (saldos a favor)."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.prepago_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_prepago_by_admin(self):
        """Prueba que un administrador pueda crear un nuevo prepago."""
        self.client.force_authenticate(user=self.admin_user)
        new_data = {
            'PER_ID': self.dummy_persona_id + 5,
            'CUR_ID': self.dummy_curso_id + 2,
            'PAP_ID': self.pago_persona.PAP_ID,
            'PPA_VALOR': '300.00',
            'PPA_OBSERVACION': 'Nuevo prepago',
            'PPA_VIGENTE': True
        }
        response = self.client.post(self.prepago_url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Prepago.objects.count(), 2)

    def test_create_prepago_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda crear un prepago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.prepago_url, self.prepago_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_prepago(self):
        """Prueba que un usuario autenticado pueda ver el detalle de un prepago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.prepago_detail_url(self.prepago.PPA_ID))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['PPA_VALOR']), 200.00)

    def test_update_prepago_by_admin(self):
        """Prueba que un administrador pueda actualizar un prepago existente."""
        self.client.force_authenticate(user=self.admin_user)
        updated_data = self.prepago_data.copy()
        updated_data['PPA_VALOR'] = '250.00'
        response = self.client.put(self.prepago_detail_url(self.prepago.PPA_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.prepago.refresh_from_db()
        self.assertEqual(float(self.prepago.PPA_VALOR), 250.00)

    def test_delete_prepago_by_admin(self):
        """Prueba que un administrador pueda eliminar un prepago."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.prepago_detail_url(self.prepago.PPA_ID))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Prepago.objects.count(), 0)

    def test_delete_prepago_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda eliminar un prepago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.prepago_detail_url(self.prepago.PPA_ID))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # --- Pruebas para ComprobantePago ---
    def test_list_comprobantes_pago(self):
        """Prueba que un usuario autenticado pueda listar los comprobantes de pago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.comprobante_pago_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_comprobante_pago_by_admin(self):
        """Prueba que un administrador pueda crear un nuevo comprobante de pago."""
        # 1. Crear pagos adicionales para asociar al nuevo comprobante.
        pago1 = self.pago_persona # Ya creado en setUp, valor 100.00
        pago2 = PagoPersona.objects.create(
            PER_ID=self.dummy_persona_id, CUR_ID=self.dummy_curso_id, USU_ID=self.admin_user,
            PAP_VALOR='50.50', PAP_TIPO=1
        )

        self.client.force_authenticate(user=self.admin_user)
        
        # 2. Preparar los datos para la API, usando la nueva lógica.
        new_data = {
            'PEC_ID': self.dummy_persona_curso_id + 1,
            'COC_ID': self.concepto_contable.COC_ID,
            'CPA_FECHA': timezone.localdate().isoformat(),
            'CPA_NUMERO': 54321,
            'pagos_ids': [pago1.PAP_ID, pago2.PAP_ID] # Enviamos los IDs de los pagos.
        }
        response = self.client.post(self.comprobante_pago_url, new_data, format='json')

        # 3. Verificar los resultados.
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ComprobantePago.objects.count(), 2)
        self.assertEqual(response.data['USU_ID'], self.admin_user.id)
        # Verificamos que el valor se haya calculado correctamente (100.00 + 50.50 = 150.50)
        self.assertEqual(float(response.data['CPA_VALOR']), 150.50)
        self.assertEqual(PagoComprobante.objects.filter(CPA_ID=response.data['CPA_ID']).count(), 2)

    def test_create_comprobante_pago_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda crear un comprobante de pago."""
        self.client.force_authenticate(user=self.user)
        data = { 'PEC_ID': 1, 'COC_ID': self.concepto_contable.COC_ID, 'CPA_NUMERO': 99, 'pagos_ids': [self.pago_persona.PAP_ID] }
        response = self.client.post(self.comprobante_pago_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_comprobante_pago(self):
        """Prueba que un usuario autenticado pueda ver el detalle de un comprobante de pago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.comprobante_pago_detail_url(self.comprobante_pago.CPA_ID))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['CPA_NUMERO'], 12345)

    def test_update_comprobante_pago_by_admin(self):
        """Prueba que un administrador pueda actualizar un comprobante de pago existente."""
        self.client.force_authenticate(user=self.admin_user)
        # Usamos PATCH para una actualización parcial, ya que PUT requeriría todos los campos.
        # Solo actualizamos un campo editable como el número del comprobante.
        updated_data = {'CPA_NUMERO': 99999}
        response = self.client.patch(self.comprobante_pago_detail_url(self.comprobante_pago.CPA_ID), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comprobante_pago.refresh_from_db()
        self.assertEqual(self.comprobante_pago.CPA_NUMERO, 99999)

    def test_delete_comprobante_pago_by_admin(self):
        """Prueba que un administrador pueda eliminar un comprobante de pago."""
        # Para evitar un ProtectedError en otras pruebas, eliminamos la relación
        # PagoComprobante antes de borrar el comprobante.
        self.pago_comprobante.delete()

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.comprobante_pago_detail_url(self.comprobante_pago.CPA_ID))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ComprobantePago.objects.count(), 0)

    def test_delete_comprobante_pago_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda eliminar un comprobante de pago."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.comprobante_pago_detail_url(self.comprobante_pago.CPA_ID))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # --- Pruebas para PagoComprobante ---
    def test_list_pagos_comprobante(self):
        """Prueba que un usuario autenticado pueda listar las relaciones pago-comprobante."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.pago_comprobante_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_pago_comprobante_by_admin(self):
        """Prueba que un administrador pueda crear una nueva relación pago-comprobante."""
        self.client.force_authenticate(user=self.admin_user)
        new_pago_persona = PagoPersona.objects.create(
            PER_ID=self.dummy_persona_id + 6,
            CUR_ID=self.dummy_curso_id + 3,
            USU_ID=self.admin_user,
            PAP_FECHA_HORA=timezone.now(),
            PAP_TIPO=1,
            PAP_VALOR='50.00',
            PAP_OBSERVACION='Otro pago'
        )
        new_comprobante_pago = ComprobantePago.objects.create(
            USU_ID=self.admin_user,
            PEC_ID=self.dummy_persona_curso_id + 2,
            COC_ID=self.concepto_contable,
            CPA_FECHA_HORA=timezone.now(),
            CPA_FECHA=timezone.localdate(),
            CPA_NUMERO=98765,
            CPA_VALOR='50.00'
        )
        new_data = {
            'PAP_ID': new_pago_persona.PAP_ID,
            'CPA_ID': new_comprobante_pago.CPA_ID
        }
        response = self.client.post(self.pago_comprobante_url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PagoComprobante.objects.count(), 2)

    def test_create_pago_comprobante_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda crear una relación pago-comprobante."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.pago_comprobante_url, self.pago_comprobante_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_pago_comprobante(self):
        """Prueba que un usuario autenticado pueda ver el detalle de una relación pago-comprobante."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.pago_comprobante_detail_url(self.pago_comprobante.PCO_ID))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['PAP_ID'], self.pago_persona.PAP_ID)

    def test_delete_pago_comprobante_by_admin(self):
        """Prueba que un administrador pueda eliminar una relación pago-comprobante."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.pago_comprobante_detail_url(self.pago_comprobante.PCO_ID))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PagoComprobante.objects.count(), 0)

    def test_delete_pago_comprobante_forbidden_for_regular_user(self):
        """Prueba que un usuario normal NO pueda eliminar una relación pago-comprobante."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.pago_comprobante_detail_url(self.pago_comprobante.PCO_ID))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
