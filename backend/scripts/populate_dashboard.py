import os
import sys
import django
import random
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scout_project.settings")
django.setup()

from personas.models import Persona, PersonaCurso
from cursos.models import Curso, CursoSeccion
from pagos.models import PagoPersona
from usuarios.models import Usuario
from maestros.models import EstadoCivil, Rama, Nivel, Rol, Alimentacion, TipoCurso, Cargo
from geografia.models import Comuna, Region, Provincia, Grupo

def populate_dashboard():
    print("Populating dashboard data...")

    # Ensure we have a user
    admin_user = Usuario.objects.first()
    if not admin_user:
        print("No user found. Please run seed_database.py first.")
        return

    # Ensure we have basic maestros
    if not EstadoCivil.objects.exists():
        print("No maestros found. Please run seed_database.py first.")
        return

    # Get or create necessary FKs
    tipo_curso, _ = TipoCurso.objects.get_or_create(tcu_descripcion="Curso General", defaults={'tcu_vigente': True, 'tcu_tipo': 1})
    cargo, _ = Cargo.objects.get_or_create(car_descripcion="Responsable", defaults={'car_vigente': True})
    
    # Create a dummy responsible person if needed
    responsable = Persona.objects.first()
    if not responsable:
        responsable = Persona.objects.create(
            esc_id=EstadoCivil.objects.first(),
            com_id=Comuna.objects.first(),
            usu_id=admin_user,
            per_run=9999999,
            per_dv='K',
            per_apelpat="Admin",
            per_nombres="Responsable",
            per_email="admin@example.com",
            per_fecha_nac=timezone.now(),
            per_direccion="Address",
            per_tipo_fono=1,
            per_fono="123",
            per_vigente=True,
            per_apodo="Admin"
        )

    # 1. Create/Get Courses (Past 6 months)
    print("Creating courses...")
    courses = []
    start_date = timezone.now() - timedelta(days=180)
    
    course_names = [
        "Curso de Alta Montaña", "Primeros Auxilios Avanzados", "Liderazgo Scout", 
        "Supervivencia en Bosque", "Navegación Terrestre", "Cocina de Campamento",
        "Gestión de Riesgos", "Fotografía de Naturaleza"
    ]

    for i, name in enumerate(course_names):
        fecha_solicitud = start_date + timedelta(days=i*20)
        curso, created = Curso.objects.get_or_create(
            cur_codigo=f"CUR-{2024}-{i+1:03d}",
            defaults={
                'cur_descripcion': name,
                'cur_fecha_solicitud': fecha_solicitud,
                'cur_estado': 1, # Activo
                'cur_lugar': 'Campo Escuela',
                'com_id_lugar': Comuna.objects.first(),
                'usu_id': admin_user,
                'tcu_id': tipo_curso,
                'per_id_responsable': responsable,
                'car_id_responsable': cargo,
                'cur_administra': 1,
                'cur_cuota_con_almuerzo': 150000,
                'cur_cuota_sin_almuerzo': 120000,
                'cur_modalidad': 1,
                'cur_tipo_curso': 1
            }
        )
        # Create section if not exists
        seccion, _ = CursoSeccion.objects.get_or_create(
            cur_id=curso,
            cus_seccion=1,
            defaults={
                'cus_cant_participante': 30
            }
        )
        courses.append(seccion)

    # 2. Create Personas (if needed)
    print("Creating personas...")
    personas = list(Persona.objects.all())
    if len(personas) < 50:
        for i in range(50 - len(personas)):
            per = Persona.objects.create(
                esc_id=EstadoCivil.objects.first(),
                com_id=Comuna.objects.first(),
                usu_id=admin_user,
                per_run=10000000 + i,
                per_dv='K',
                per_apelpat=f"Apellido{i}",
                per_nombres=f"Nombre{i}",
                per_email=f"persona{i}@example.com",
                per_fecha_nac=timezone.now() - timedelta(days=365*20),
                per_direccion="Calle Falsa 123",
                per_tipo_fono=1,
                per_fono="912345678",
                per_vigente=True,
                per_apodo=f"Scout{i}"
            )
            personas.append(per)

    # 3. Create Enrollments (PersonaCurso)
    print("Creating enrollments...")
    rol = Rol.objects.first()
    alim = Alimentacion.objects.first()
    
    for person in personas:
        # Enroll in 1-3 random courses
        selected_courses = random.sample(courses, k=random.randint(0, 3))
        for section in selected_courses:
            # Random status
            is_registered = random.choice([True, True, True, False]) # 75% registered
            is_accredited = is_registered and random.choice([True, False]) # 50% of registered are accredited
            
            PersonaCurso.objects.get_or_create(
                per_id=person,
                cus_id=section,
                defaults={
                    'rol_id': rol,
                    'ali_id': alim,
                    'pec_registro': is_registered,
                    'pec_acreditado': is_accredited,
                    'pec_observacion': "Inscripción generada automáticamente"
                }
            )

    # 4. Create Payments (PagoPersona)
    print("Creating payments...")
    # Clear existing payments to avoid duplicates/mess if re-running (optional, maybe just add)
    # PagoPersona.objects.all().delete() 
    
    for i in range(100): # Generate 100 payments distributed over 6 months
        days_ago = random.randint(0, 180)
        payment_date = timezone.now() - timedelta(days=days_ago)
        
        person = random.choice(personas)
        course_section = random.choice(courses)
        
        # 80% Income, 20% Expense
        is_income = random.random() < 0.8
        amount = random.randint(10000, 150000) if is_income else random.randint(5000, 50000)
        
        PagoPersona.objects.create(
            per_id=person,
            cur_id=course_section.cur_id,
            usu_id=admin_user,
            pap_fecha_hora=payment_date,
            pap_tipo=1 if is_income else 2,
            pap_valor=amount,
            pap_observacion=f"Pago generado auto {i}"
        )

    print("Dashboard data populated successfully!")

if __name__ == "__main__":
    populate_dashboard()
