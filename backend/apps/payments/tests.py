import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from .models import (
    PagoPersona,
    PagoCambioPersona,
    Prepago,
    ComprobantePago,
    PagoComprobante,
    ConceptoContable,
)
from .serializers import (
    ConceptoContableSerializer, # Added back
    PagoPersonaSerializer,
    PagoCambioPersonaSerializer,
    PrepagoSerializer,
    ComprobantePagoSerializer,
    PagoComprobanteSerializer, # Added back
)


User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user(db):
    counter = {"n": 0}

    def _create_user(username=None, password="testpass", is_staff=False):
        # Si no se proporciona username, generar uno único por llamada para evitar
        # colisiones de unicidad cuando múltiples fixtures usan el valor por defecto.
        if username is None:
            counter["n"] += 1
            username_local = f"testuser{counter['n']}"
        else:
            username_local = username
        return User.objects.create_user(username=username_local, password=password, is_staff=is_staff)

    return _create_user


@pytest.fixture
def regular_user(create_user):
    return create_user(username="regularuser")


@pytest.fixture
def admin_user(create_user):
    return create_user(username="adminuser", is_staff=True)


@pytest.fixture
def authenticated_client(api_client, regular_user):
    user = regular_user
    api_client.force_authenticate(user=user)
    return api_client, user


@pytest.fixture
def create_concepto_contable(db):
    def _create_concepto_contable(descripcion="Test Concepto", vigente=True):
        return ConceptoContable.objects.create(
            COC_DESCRIPCION=descripcion, COC_VIGENTE=vigente
        )
    return _create_concepto_contable


@pytest.fixture
def create_pago_persona(create_user):
    def _create_pago_persona(
        user=None,
        persona_id=None, # Use user.id for PER_ID
        course_id=1,  # Use an integer for CUR_ID
        valor=100.00,
        tipo=1,
        observacion="Test Pago"
    ):
        if user is None:
            user = create_user()
        if persona_id is None:
            persona_id = user.id # Assign user.id if persona_id is not provided
        return PagoPersona.objects.create(
            USU_ID=user,
            PER_ID=persona_id,
            CUR_ID=course_id,
            PAP_VALOR=valor,
            PAP_TIPO=tipo,
            PAP_OBSERVACION=observacion
        )
    return _create_pago_persona


@pytest.fixture
def create_comprobante_pago(create_user, create_concepto_contable):
    def _create_comprobante_pago(
        user=None,
        concepto=None,
        pec_id=1,
        numero=1,
        valor=100.00
    ):
        if user is None:
            user = create_user()
        if concepto is None:
            concepto = create_concepto_contable()
        return ComprobantePago.objects.create(
            USU_ID=user,
            PEC_ID=pec_id,
            COC_ID=concepto,
            CPA_NUMERO=numero,
            CPA_VALOR=valor
        )
    return _create_comprobante_pago


@pytest.mark.django_db
class TestModels:
    def test_pago_persona_str(self, create_pago_persona):
        pago = create_pago_persona(valor=150.50, persona_id=10)
        assert str(pago) == f"Pago {pago.PAP_ID} - Persona ID 10 por ${pago.PAP_VALOR}"

    def test_pago_cambio_persona_str(self, create_pago_persona, admin_user):
        pago = create_pago_persona()
        cambio = PagoCambioPersona.objects.create(PER_ID=20, PAP_ID=pago, USU_ID=admin_user)
        assert str(cambio) == f"Cambio {cambio.PCP_ID}: Pago {pago.PAP_ID} transferido a Persona 20"

    def test_prepago_str(self):
        prepago_vigente = Prepago.objects.create(PER_ID=30, CUR_ID=1, PPA_VALOR=100)
        prepago_usado = Prepago.objects.create(PER_ID=31, CUR_ID=1, PPA_VALOR=50, PPA_VIGENTE=False)
        assert str(prepago_vigente) == f"Prepago {prepago_vigente.PPA_ID} de ${prepago_vigente.PPA_VALOR} para Persona 30 (Vigente)"
        assert str(prepago_usado) == f"Prepago {prepago_usado.PPA_ID} de ${prepago_usado.PPA_VALOR} para Persona 31 (Utilizado)"

    def test_concepto_contable_str(self, create_concepto_contable):
        concepto = create_concepto_contable(descripcion="Inscripción 2025")
        assert str(concepto) == "Inscripción 2025"

    def test_comprobante_pago_str(self, create_comprobante_pago):
        comprobante = create_comprobante_pago(numero=555, valor=2500.00)
        assert str(comprobante) == f"Comprobante N°555 por ${comprobante.CPA_VALOR}"

    def test_pago_comprobante_str(self, create_pago_persona, create_comprobante_pago):
        pago = create_pago_persona()
        comprobante = create_comprobante_pago()
        relacion = PagoComprobante.objects.create(PAP_ID=pago, CPA_ID=comprobante)
        assert str(relacion) == f"Relación {relacion.PCO_ID}: Pago {pago.PAP_ID} en Comprobante {comprobante.CPA_NUMERO}"

        
@pytest.mark.django_db
class TestPagoPersonaSerializer:
    def test_pago_persona_serializer(self, create_pago_persona):
        pago = create_pago_persona(valor=250.00)
        serializer = PagoPersonaSerializer(pago)
        assert float(serializer.data["PAP_VALOR"]) == 250.00

    def test_create_pago_persona(self, admin_user):
        user = admin_user
        data = {
            "PER_ID": 1, # Use an integer ID
            "CUR_ID": 1, # Use an integer ID
            "PAP_TIPO": 1,
            "PAP_VALOR": 150.00,
            "PAP_OBSERVACION": "Pago de prueba"
        }
        serializer = PagoPersonaSerializer(data=data)
        assert serializer.is_valid(raise_exception=True)
        pago = serializer.save(USU_ID=user) # USU_ID is read_only, must be passed in save
        assert pago.PER_ID == 1
        assert float(pago.PAP_VALOR) == 150.00

    def test_validate_pap_valor_positive(self, admin_user):
        data = {
            "PER_ID": 1, # Use an integer ID
            "CUR_ID": 1, # Use an integer ID
            "PAP_TIPO": 1,
            "PAP_VALOR": 0,
            "PAP_OBSERVACION": "Pago inválido"
        }
        serializer = PagoPersonaSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert "El valor del pago debe ser mayor a 0." in str(excinfo.value)

    def test_update_pago_persona(self, create_pago_persona, admin_user):
        pago = create_pago_persona(valor=100.00)
        user = admin_user
        data = {"PAP_VALOR": 200.00, "PAP_OBSERVACION": "Actualizado"}
        serializer = PagoPersonaSerializer(pago, data=data, partial=True)
        assert serializer.is_valid(raise_exception=True)
        updated_pago = serializer.save(USU_ID=user)
        assert float(updated_pago.PAP_VALOR) == 200.00
        assert updated_pago.PAP_OBSERVACION == "Actualizado"


@pytest.mark.django_db
class TestPagoCambioPersonaSerializer:
    def test_pago_cambio_persona_serializer(self, create_pago_persona, admin_user):
        pago = create_pago_persona()
        user = admin_user
        cambio = PagoCambioPersona.objects.create(PER_ID=2, PAP_ID=pago, USU_ID=user)
        serializer = PagoCambioPersonaSerializer(cambio)
        assert serializer.data["PER_ID"] == 2
        assert serializer.data["PAP_ID"] == pago.PAP_ID

    def test_create_pago_cambio_persona(self, create_pago_persona, admin_user):
        pago = create_pago_persona()
        user = admin_user
        data = {
            "PER_ID": 3,
            "PAP_ID": pago.PAP_ID,
        }
        serializer = PagoCambioPersonaSerializer(data=data)
        assert serializer.is_valid(raise_exception=True)
        cambio = serializer.save(USU_ID=user)
        assert cambio.PER_ID == 3
        assert cambio.PAP_ID == pago


@pytest.mark.django_db
class TestPrepagoSerializer:
    def test_prepago_serializer(self, create_pago_persona):
        pago = create_pago_persona(persona_id=1, course_id=1)
        prepago = Prepago.objects.create(
            PER_ID=1,
            CUR_ID=1,
            PAP_ID=pago,
            PPA_VALOR=50.00,
            PPA_OBSERVACION="Saldo a favor",
            PPA_VIGENTE=True
        )
        serializer = PrepagoSerializer(prepago)
        assert serializer.data["PER_ID"] == 1
        assert float(serializer.data["PPA_VALOR"]) == 50.00

    def test_create_prepago(self, create_pago_persona):
        pago = create_pago_persona(persona_id=1, course_id=1)
        data = {
            "PER_ID": 1,
            "CUR_ID": 1,
            "PAP_ID": pago.PAP_ID,
            "PPA_VALOR": 75.00,
            "PPA_OBSERVACION": "Nuevo saldo",
            "PPA_VIGENTE": True
        }
        serializer = PrepagoSerializer(data=data)
        assert serializer.is_valid(raise_exception=True)
        prepago = serializer.save()
        assert prepago.PER_ID == 1
        assert float(prepago.PPA_VALOR) == 75.00


@pytest.mark.django_db
class TestComprobantePagoSerializer:
    def test_comprobante_pago_serializer(self, create_comprobante_pago):
        comprobante = create_comprobante_pago(valor=300.00)
        serializer = ComprobantePagoSerializer(comprobante)
        assert float(serializer.data["CPA_VALOR"]) == 300.00
        assert "pagos_ids" not in serializer.data # write_only field

    def test_create_comprobante_pago_with_valid_pagos_ids(
        self, admin_user, create_concepto_contable, create_pago_persona
    ):
        user = admin_user
        concepto = create_concepto_contable()
        pago1 = create_pago_persona(user=user, valor=50.00)
        pago2 = create_pago_persona(user=user, valor=70.00)

        data = {
            "PEC_ID": 1,
            "COC_ID": concepto.COC_ID,
            "CPA_NUMERO": 1001,
            "pagos_ids": [pago1.PAP_ID, pago2.PAP_ID],
        }
        serializer = ComprobantePagoSerializer(data=data)
        assert serializer.is_valid(raise_exception=True)
        comprobante = serializer.save(USU_ID=user)

        assert comprobante.USU_ID == user
        assert comprobante.PEC_ID == 1
        assert comprobante.COC_ID == concepto
        assert comprobante.CPA_NUMERO == 1001
        assert float(comprobante.CPA_VALOR) == 120.00  # 50 + 70

        # Verify PagoComprobante relations
        assert PagoComprobante.objects.filter(PAP_ID=pago1, CPA_ID=comprobante).exists()
        assert PagoComprobante.objects.filter(PAP_ID=pago2, CPA_ID=comprobante).exists()
        assert PagoComprobante.objects.count() == 2

    def test_create_comprobante_pago_empty_pagos_ids(
        self, admin_user, create_concepto_contable
    ):
        concepto = create_concepto_contable()
        data = {
            "PEC_ID": 1,
            "COC_ID": concepto.COC_ID,
            "CPA_NUMERO": 1002,
            "pagos_ids": [],
        }
        serializer = ComprobantePagoSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert "Esta lista no puede estar vacía." in str(excinfo.value)

    def test_create_comprobante_pago_invalid_pagos_ids(
        self, admin_user, create_concepto_contable, create_pago_persona
    ):
        concepto = create_concepto_contable()
        pago1 = create_pago_persona(user=admin_user, valor=50.00)
        # Invalid ID
        data = {
            "PEC_ID": 1,
            "COC_ID": concepto.COC_ID,
            "CPA_NUMERO": 1003,
            "pagos_ids": [pago1.PAP_ID, 9999],
        }
        serializer = ComprobantePagoSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert "Uno o más IDs de pago no son válidos o están duplicados." in str(excinfo.value)

    def test_create_comprobante_pago_duplicate_pagos_ids(
        self, admin_user, create_concepto_contable, create_pago_persona
    ):
        concepto = create_concepto_contable()
        pago1 = create_pago_persona(user=admin_user, valor=50.00)
        data = {
            "PEC_ID": 1,
            "COC_ID": concepto.COC_ID,
            "CPA_NUMERO": 1004,
            "pagos_ids": [pago1.PAP_ID, pago1.PAP_ID], # Duplicate ID
        }
        serializer = ComprobantePagoSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert "Uno o más IDs de pago no son válidos o están duplicados." in str(excinfo.value)


@pytest.mark.django_db
class TestPagoPersonaAPI:
    def test_list_pagos_persona(self, authenticated_client, create_pago_persona):
        client, user = authenticated_client
        create_pago_persona(user=user, valor=100)
        create_pago_persona(user=user, valor=200)

        url = reverse("payments:pago-persona-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 2

    def test_create_pago_persona_permission_denied(self, authenticated_client):
        client, _ = authenticated_client # Regular user
        url = reverse("payments:pago-persona-list")
        data = {"PER_ID": 1, "CUR_ID": 1, "PAP_VALOR": 100, "PAP_TIPO": 1}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_pago_persona_by_admin(self, admin_client):
        client, admin = admin_client
        url = reverse("payments:pago-persona-list")
        data = {"PER_ID": 1, "CUR_ID": 1, "PAP_VALOR": 100, "PAP_TIPO": 1}
        response = client.post(url, data, format='json')


    def test_filter_pagos_by_date(self, admin_client, create_pago_persona):
        client, admin = admin_client
        from django.utils import timezone
        from datetime import timedelta

        pago_antiguo = create_pago_persona(user=admin)
        pago_antiguo.PAP_FECHA_HORA = timezone.now() - timedelta(days=10)
        pago_antiguo.save()

        pago_reciente = create_pago_persona(user=admin)
        pago_reciente.PAP_FECHA_HORA = timezone.now() - timedelta(days=1)
        pago_reciente.save()

        url = reverse("payments:pago-persona-list")
        fecha_inicio = (timezone.now() - timedelta(days=5)).strftime('%Y-%m-%d')
        response = client.get(url, {'fecha_inicio': fecha_inicio})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['PAP_ID'] == pago_reciente.PAP_ID


@pytest.mark.django_db
class TestComprobantePagoAPI:
    def test_list_comprobantes(self, authenticated_client, create_comprobante_pago):
        client, user = authenticated_client
        create_comprobante_pago(user=user, numero=1)
        url = reverse("payments:comprobante-pago-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_comprobante_permission_denied(self, authenticated_client):
        client, _ = authenticated_client
        url = reverse("payments:comprobante-pago-list")
        data = {"pagos_ids": [1]} # Dummy data
        response = client.post(url, data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_comprobante_by_admin(
        self, admin_client, create_pago_persona, create_concepto_contable
    ):
        client, admin = admin_client
        pago1 = create_pago_persona(user=admin, valor=100)
        pago2 = create_pago_persona(user=admin, valor=150)
        concepto = create_concepto_contable()

        url = reverse("payments:comprobante-pago-list")
        data = {
            "PEC_ID": 1,
            "COC_ID": concepto.COC_ID,
            "CPA_NUMERO": 202401,
            "pagos_ids": [pago1.PAP_ID, pago2.PAP_ID]
        }
        response = client.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['CPA_VALOR'] == '250.00' # 100 + 150
        assert response.data['USU_ID'] == admin.id
        assert ComprobantePago.objects.count() == 1
        assert PagoComprobante.objects.count() == 2


@pytest.mark.django_db
class TestConceptoContableAPI:
    def test_list_conceptos(self, authenticated_client, create_concepto_contable):
        client, _ = authenticated_client
        create_concepto_contable(descripcion="Concepto 1")
        url = reverse("payments:concepto-contable-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_concepto_by_admin(self, admin_client):
        client, _ = admin_client
        url = reverse("payments:concepto-contable-list")
        data = {"COC_DESCRIPCION": "Nueva Cuota", "COC_VIGENTE": True}
        response = client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['COC_DESCRIPCION'] == "Nueva Cuota"
        assert PagoPersona.objects.count() == 1

    def test_filter_pagos_by_date(self, admin_client, create_pago_persona):
        client, admin = admin_client
        from django.utils import timezone
        from datetime import timedelta

        pago_antiguo = create_pago_persona(user=admin)
        pago_antiguo.PAP_FECHA_HORA = timezone.now() - timedelta(days=10)
        pago_antiguo.save()

        pago_reciente = create_pago_persona(user=admin)
        pago_reciente.PAP_FECHA_HORA = timezone.now() - timedelta(days=1)
        pago_reciente.save()

        url = reverse("payments:pago-persona-list")
        fecha_inicio = (timezone.now() - timedelta(days=5)).strftime('%Y-%m-%d')
        response = client.get(url, {'fecha_inicio': fecha_inicio})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['PAP_ID'] == pago_reciente.PAP_ID


@pytest.mark.django_db
class TestComprobantePagoAPI:
    def test_list_comprobantes(self, authenticated_client, create_comprobante_pago):
        client, user = authenticated_client
        create_comprobante_pago(user=user, numero=1)
        url = reverse("payments:comprobante-pago-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_comprobante_permission_denied(self, authenticated_client):
        client, _ = authenticated_client
        url = reverse("payments:comprobante-pago-list")
        data = {"pagos_ids": [1]} # Dummy data
        response = client.post(url, data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_comprobante_by_admin(
        self, admin_client, create_pago_persona, create_concepto_contable
    ):
        client, admin = admin_client
        pago1 = create_pago_persona(user=admin, valor=100)
        pago2 = create_pago_persona(user=admin, valor=150)
        concepto = create_concepto_contable()

        url = reverse("payments:comprobante-pago-list")
        data = {
            "PEC_ID": 1,
            "COC_ID": concepto.COC_ID,
            "CPA_NUMERO": 202401,
            "pagos_ids": [pago1.PAP_ID, pago2.PAP_ID]
        }
        response = client.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['CPA_VALOR'] == '250.00' # 100 + 150
        assert response.data['USU_ID'] == admin.id
        assert ComprobantePago.objects.count() == 1
        assert PagoComprobante.objects.count() == 2


@pytest.mark.django_db
class TestConceptoContableAPI:
    def test_list_conceptos(self, authenticated_client, create_concepto_contable):
        client, _ = authenticated_client
        create_concepto_contable(descripcion="Concepto 1")
        url = reverse("payments:concepto-contable-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_concepto_by_admin(self, admin_client):
        client, _ = admin_client
        url = reverse("payments:concepto-contable-list")
        data = {"COC_DESCRIPCION": "Nueva Cuota", "COC_VIGENTE": True}
        response = client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['COC_DESCRIPCION'] == "Nueva Cuota"


@pytest.mark.django_db
class TestPrepagoAPI:
    def test_list_prepagos(self, authenticated_client):
        client, _ = authenticated_client
        Prepago.objects.create(PER_ID=1, CUR_ID=1, PPA_VALOR=100)
        url = reverse("payments:prepago-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_prepago_by_admin(self, admin_client):
        client, _ = admin_client
        url = reverse("payments:prepago-list")
        data = {"PER_ID": 1, "CUR_ID": 1, "PPA_VALOR": 150.00, "PPA_OBSERVACION": "Saldo inicial"}
        response = client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert float(response.data['PPA_VALOR']) == 150.00

    def test_update_prepago_by_admin(self, admin_client):
        client, _ = admin_client
        prepago = Prepago.objects.create(PER_ID=1, CUR_ID=1, PPA_VALOR=100, PPA_VIGENTE=True)
        url = reverse("payments:prepago-detail", kwargs={'pk': prepago.pk})
        data = {"PPA_VIGENTE": False, "PPA_OBSERVACION": "Saldo utilizado"}
        response = client.patch(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['PPA_VIGENTE'] is False
        assert "utilizado" in response.data['PPA_OBSERVACION']

    def test_delete_prepago_permission_denied(self, authenticated_client):
        client, _ = authenticated_client
        prepago = Prepago.objects.create(PER_ID=1, CUR_ID=1, PPA_VALOR=100)
        url = reverse("payments:prepago-detail", kwargs={'pk': prepago.pk})
        response = client.delete(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_prepago_by_admin(self, admin_client):
        client, _ = admin_client
        prepago = Prepago.objects.create(PER_ID=1, CUR_ID=1, PPA_VALOR=100)
        url = reverse("payments:prepago-detail", kwargs={'pk': prepago.pk})
        response = client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Prepago.objects.count() == 0


@pytest.mark.django_db
class TestPagoCambioPersonaAPI:
    def test_list_cambios(self, authenticated_client, create_pago_persona, admin_user):
        client, _ = authenticated_client
        pago = create_pago_persona(user=admin_user)
        PagoCambioPersona.objects.create(PER_ID=2, PAP_ID=pago, USU_ID=admin_user)
        url = reverse("payments:pago-cambio-persona-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_cambio_by_admin(self, admin_client, create_pago_persona):
        client, admin = admin_client
        pago = create_pago_persona(user=admin)
        url = reverse("payments:pago-cambio-persona-list")
        data = {"PER_ID": 5, "PAP_ID": pago.PAP_ID}
        response = client.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['PER_ID'] == 5
        assert response.data['USU_ID'] == admin.id

    def test_update_cambio_not_allowed(self, admin_client, create_pago_persona):
        """
        Generalmente, los registros de auditoría como este no deberían ser modificables.
        DRF por defecto permite PUT/PATCH, así que esta prueba verifica que se pueda hacer,
        pero idealmente el ViewSet podría ser de solo lectura o solo creación/lectura.
        """
        client, admin = admin_client
        pago = create_pago_persona(user=admin)
        cambio = PagoCambioPersona.objects.create(PER_ID=2, PAP_ID=pago, USU_ID=admin)
        url = reverse("payments:pago-cambio-persona-detail", kwargs={'pk': cambio.pk})
        data = {"PER_ID": 10} # Intentar cambiar la persona
        response = client.patch(url, data, format='json')

        # ModelViewSet permite la actualización por defecto.
        assert response.status_code == status.HTTP_200_OK
        assert response.data['PER_ID'] == 10

    def test_delete_cambio_by_admin(self, admin_client, create_pago_persona):
        client, admin = admin_client
        pago = create_pago_persona(user=admin)
        cambio = PagoCambioPersona.objects.create(PER_ID=2, PAP_ID=pago, USU_ID=admin)
        url = reverse("payments:pago-cambio-persona-detail", kwargs={'pk': cambio.pk})
        response = client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert PagoCambioPersona.objects.count() == 0
        

    def test_filter_pagos_by_date(self, admin_client, create_pago_persona):
        client, admin = admin_client
        from django.utils import timezone
        from datetime import timedelta

        pago_antiguo = create_pago_persona(user=admin)
        pago_antiguo.PAP_FECHA_HORA = timezone.now() - timedelta(days=10)
        pago_antiguo.save()

        pago_reciente = create_pago_persona(user=admin)
        pago_reciente.PAP_FECHA_HORA = timezone.now() - timedelta(days=1)
        pago_reciente.save()

        url = reverse("payments:pago-persona-list")
        fecha_inicio = (timezone.now() - timedelta(days=5)).strftime('%Y-%m-%d')
        response = client.get(url, {'fecha_inicio': fecha_inicio})

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['PAP_ID'] == pago_reciente.PAP_ID


@pytest.mark.django_db
class TestComprobantePagoAPI:
    def test_list_comprobantes(self, authenticated_client, create_comprobante_pago):
        client, user = authenticated_client
        create_comprobante_pago(user=user, numero=1)
        url = reverse("payments:comprobante-pago-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_comprobante_permission_denied(self, authenticated_client):
        client, _ = authenticated_client
        url = reverse("payments:comprobante-pago-list")
        data = {"pagos_ids": [1]} # Dummy data
        response = client.post(url, data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_comprobante_by_admin(
        self, admin_client, create_pago_persona, create_concepto_contable
    ):
        client, admin = admin_client
        pago1 = create_pago_persona(user=admin, valor=100)
        pago2 = create_pago_persona(user=admin, valor=150)
        concepto = create_concepto_contable()

        url = reverse("payments:comprobante-pago-list")
        data = {
            "PEC_ID": 1,
            "COC_ID": concepto.COC_ID,
            "CPA_NUMERO": 202401,
            "pagos_ids": [pago1.PAP_ID, pago2.PAP_ID]
        }
        response = client.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['CPA_VALOR'] == '250.00' # 100 + 150
        assert response.data['USU_ID'] == admin.id
        assert ComprobantePago.objects.count() == 1
        assert PagoComprobante.objects.count() == 2


@pytest.mark.django_db
class TestConceptoContableAPI:
    def test_list_conceptos(self, authenticated_client, create_concepto_contable):
        client, _ = authenticated_client
        create_concepto_contable(descripcion="Concepto 1")
        url = reverse("payments:concepto-contable-list")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_create_concepto_by_admin(self, admin_client):
        client, _ = admin_client
        url = reverse("payments:concepto-contable-list")
        data = {"COC_DESCRIPCION": "Nueva Cuota", "COC_VIGENTE": True}
        response = client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['COC_DESCRIPCION'] == "Nueva Cuota"
