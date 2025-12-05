import os
import sys
import django
from django.conf import settings
from decimal import Decimal
from datetime import datetime

# Setup Django environment
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

from pagos.utils import generate_payment_pdf
from pagos.models import PagoPersona
from personas.models import Persona
from cursos.models import Curso
from usuarios.models import Usuario

def test_qr_generation():
    print("Creating dummy data...")
    # Create dummy objects (in memory or db if needed, but we need IDs for the PDF)
    # We will mock the objects to avoid DB writes if possible, or just create them if DB is accessible.
    # Since we are in a script, we might need to actually create them or mock them.
    # Let's try to mock the structure expected by generate_payment_pdf
    
    class MockUser:
        usu_username = "test_user"

    class MockCurso:
        cur_descripcion = "Curso Test QR"
        cur_latitud = Decimal("-33.4489")
        cur_longitud = Decimal("-70.6693")

    class MockPersona:
        per_nombres = "Juan"
        per_apelpat = "Perez"
        per_apelmat = "Gonzalez"
        per_run = "12345678"
        per_dv = "9"

    class MockPago:
        pap_id = 99999
        pap_tipo = 1
        pap_estado = 1
        pap_fecha_hora = django.utils.timezone.now()
        pap_valor = 50000
        pap_observacion = "Pago de prueba con QR"
        per_id = MockPersona()
        cur_id = MockCurso()
        usu_id = MockUser()

    print("Generating PDF...")
    try:
        pdf_buffer = generate_payment_pdf(MockPago())
        print(f"PDF generated successfully. Size: {len(pdf_buffer.getvalue())} bytes")
        
        # Save to file for manual inspection if needed (optional)
        with open("test_comprobante_qr.pdf", "wb") as f:
            f.write(pdf_buffer.getvalue())
        print("Saved to test_comprobante_qr.pdf")
        
    except Exception as e:
        print(f"FAILED to generate PDF: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_qr_generation()
