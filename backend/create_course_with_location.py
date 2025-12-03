import os
import django
import sys
from decimal import Decimal

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

from cursos.models import Curso
from maestros.models import TipoCurso, Cargo
from geografia.models import Comuna
from usuarios.models import Usuario
# Assuming Persona is in personas app
from personas.models import Persona
from django.utils import timezone

def create_course():
    print("Iniciando creación de curso de prueba...")
    
    # Fetch required foreign keys
    try:
        usuario = Usuario.objects.first()
        if not usuario:
            print("Error: No se encontró ningún Usuario.")
            return

        tipo_curso = TipoCurso.objects.first()
        if not tipo_curso:
            print("Error: No se encontró ningún TipoCurso.")
            return

        persona = Persona.objects.first()
        if not persona:
            print("Error: No se encontró ninguna Persona.")
            return

        cargo = Cargo.objects.first()
        if not cargo:
            print("Error: No se encontró ningún Cargo.")
            return

        comuna = Comuna.objects.first()
        if not comuna:
            print("Error: No se encontró ninguna Comuna.")
            return

        print(f"Datos maestros encontrados:")
        print(f"- Usuario: {usuario}")
        print(f"- TipoCurso: {tipo_curso}")
        print(f"- Persona: {persona}")
        print(f"- Cargo: {cargo}")
        print(f"- Comuna: {comuna}")

        # Create Curso
        curso = Curso.objects.create(
            usu_id=usuario,
            tcu_id=tipo_curso,
            per_id_responsable=persona,
            car_id_responsable=cargo,
            com_id_lugar=comuna,
            cur_fecha_solicitud=timezone.now(),
            cur_codigo='QR-TEST-01',
            cur_descripcion='Curso Prueba QR y Ubicación',
            cur_observacion='Generado automáticamente para pruebas de integración',
            cur_administra=1,
            cur_cuota_con_almuerzo=Decimal('15000.00'),
            cur_cuota_sin_almuerzo=Decimal('5000.00'),
            cur_modalidad=1, # Presencial
            cur_tipo_curso=1, # Inicial
            cur_lugar='Parque Central',
            cur_latitud=Decimal('-33.4489'), # Santiago
            cur_longitud=Decimal('-70.6693'),
            cur_estado=1 # Activo
        )
        
        print("\n" + "="*50)
        print(f"¡CURSO CREADO EXITOSAMENTE!")
        print("="*50)
        print(f"ID: {curso.cur_id}")
        print(f"Código: {curso.cur_codigo}")
        print(f"Descripción: {curso.cur_descripcion}")
        print(f"Ubicación: {curso.cur_lugar} ({comuna.com_descripcion})")
        print(f"Coordenadas: {curso.cur_latitud}, {curso.cur_longitud}")
        print("="*50)
        print("Listo para conectar con el sistema de QR de pagos.")
        
    except Exception as e:
        print(f"\nError creando curso: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_course()
