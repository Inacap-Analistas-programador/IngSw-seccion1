import sys
import warnings

import pytest

if "tests" in sys.modules:
    mod = sys.modules.get("tests")
    try:
        mod_file = getattr(mod, "__file__", None) or getattr(mod, "__path__", None)
        if mod_file and "\\backend\\tests" in str(mod_file):
            del sys.modules["tests"]
    except (AttributeError, KeyError) as e:
        warnings.warn(
            f"conftest: no se pudo limpiar sys.modules['tests'] de backend/tests: {e}",
            RuntimeWarning,
        )
try:
    if "tests" not in sys.modules:
        import os
        import types

        shim_path = os.path.join(os.path.dirname(__file__), "tests.py")
        shim = types.ModuleType("tests")
        shim.__file__ = shim_path
        sys.modules["tests"] = shim
except Exception as e:
    warnings.warn(
        f"conftest: no se pudo crear shim para 'tests' ({e.__class__.__name__}: {e})",
        RuntimeWarning,
    )
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from payments.models import ComprobantePago, ConceptoContable, PagoPersona

User = get_user_model()


@pytest.fixture
def api_client():
    """
    Fixture que proporciona un cliente de API de DRF no autenticado.
    """
    return APIClient()


@pytest.fixture
def create_user(db):
    """
    Factory fixture para crear usuarios.
    Permite crear usuarios normales o administradores (staff).
    """

    def _create_user(username="testuser", password="testpass", is_staff=False):
        return User.objects.create_user(
            username=username, password=password, is_staff=is_staff
        )

    return _create_user


@pytest.fixture
def regular_user(create_user):
    """
    Fixture que crea y devuelve un usuario regular.
    """
    return create_user(username="regularuser")


@pytest.fixture
def admin_user(create_user):
    """
    Fixture que crea y devuelve un usuario administrador.
    """
    return create_user(username="adminuser", is_staff=True)


@pytest.fixture
def authenticated_client(api_client, regular_user):
    """
    Fixture que devuelve un cliente de API autenticado como usuario regular.
    """
    api_client.force_authenticate(user=regular_user)
    return api_client, regular_user


@pytest.fixture
def admin_client(api_client, admin_user):
    """
    Fixture que devuelve un cliente de API autenticado como administrador.
    """
    api_client.force_authenticate(user=admin_user)
    return api_client, admin_user


@pytest.fixture
def create_concepto_contable(db):
    """
    Factory fixture para crear conceptos contables.
    """

    def _create_concepto_contable(descripcion="Test Concepto", vigente=True):
        return ConceptoContable.objects.create(
            COC_DESCRIPCION=descripcion, COC_VIGENTE=vigente
        )

    return _create_concepto_contable


@pytest.fixture
def create_pago_persona(create_user):
    """
    Factory fixture para crear un PagoPersona.
    """

    def _create_pago_persona(
        user=None,
        persona_id=1,
        course_id=1,
        valor=100.00,
        tipo=1,
        observacion="Test Pago",
    ):
        if user is None:
            # Evita IntegrityError si se llama varias veces sin especificar usuario
            user = create_user(username=f"pago_user_{PagoPersona.objects.count()}")
        return PagoPersona.objects.create(
            USU_ID=user,
            PER_ID=persona_id,
            CUR_ID=course_id,
            PAP_VALOR=valor,
            PAP_TIPO=tipo,
            PAP_OBSERVACION=observacion,
        )

    return _create_pago_persona


@pytest.fixture
def create_comprobante_pago(create_user, create_concepto_contable):
    """
    Factory fixture para crear un ComprobantePago.
    """

    def _create_comprobante_pago(
        user=None, concepto=None, pec_id=1, numero=None, valor=100.00
    ):
        if user is None:
            user = create_user(
                username=f"comprobante_user_{ComprobantePago.objects.count()}"
            )
        if concepto is None:
            # Evita IntegrityError por descripción duplicada
            concepto = create_concepto_contable(
                descripcion=f"Concepto {ComprobantePago.objects.count()}"
            )
        if numero is None:
            numero = 1000 + ComprobantePago.objects.count()
        return ComprobantePago.objects.create(
            USU_ID=user,
            PEC_ID=pec_id,
            COC_ID=concepto,
            CPA_NUMERO=numero,
            CPA_VALOR=valor,
        )

    return _create_comprobante_pago
