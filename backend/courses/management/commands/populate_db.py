import random
from django.core.management.base import BaseCommand
from faker import Faker
from courses.models import Curso, TipoCurso
from personas.models import Persona
from catalog.models import Comuna, EstadoCivil, Provincia, Region, Cargo
from authentication.models import Usuario as User

class Command(BaseCommand):
    help = 'Populates the database with mock data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        Curso.objects.all().delete()
        Persona.objects.all().delete()
        TipoCurso.objects.all().delete()
        Comuna.objects.all().delete()
        Provincia.objects.all().delete()
        Region.objects.all().delete()
        EstadoCivil.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        fake = Faker('es_ES')

        # Create some base data if it doesn't exist
        if not User.objects.exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin')
        
        if not EstadoCivil.objects.exists():
            EstadoCivil.objects.create(id=1, descripcion='Soltero/a', vigente=True)

        if not Comuna.objects.exists():
            # This is a simplification. In a real scenario, you'd populate all comunas.
            if not Region.objects.exists():
                Region.objects.create(id=1, descripcion='Biobío', vigente=True)
            if not Provincia.objects.exists():
                Provincia.objects.create(id=1, region_id=1, descripcion='Concepción', vigente=True)
            Comuna.objects.create(id=1, provincia_id=1, descripcion='Concepción', vigente=True)

        if not TipoCurso.objects.exists():
            TipoCurso.objects.create(id=1, descripcion='Curso Básico', tipo=1, vigente=True)
            TipoCurso.objects.create(id=2, descripcion='Curso Avanzado', tipo=2, vigente=True)

        if not Cargo.objects.exists():
            Cargo.objects.create(id=1, descripcion='Jefe de Grupo', vigente=True)

        # Create Personas
        last_persona_id = Persona.objects.last().id if Persona.objects.exists() else 0
        for i in range(10):
            Persona.objects.create(
                id=last_persona_id + i + 1,
                estado_civil_id=1,
                comuna_id=1,
                usuario_id=1,
                run=fake.random_number(digits=8),
                digito_verificador=fake.random_letter(),
                apelpat=fake.last_name(),
                nombres=fake.first_name(),
                email=fake.email(),
                fecha_nac=fake.date_of_birth(),
                direccion=fake.address(),
                tipo_fono=1,
                fono=fake.phone_number(),
                apodo=fake.user_name(),
                fecha_hora=fake.date_time(),
                vigente=True,
            )

        # Create Cursos
        last_curso_id = Curso.objects.last().id if Curso.objects.exists() else 0
        for i in range(5):
            Curso.objects.create(
                id=last_curso_id + i + 1,
                usuario_id=1,
                tipo_curso_id=random.randint(1, 2),
                persona_responsable_id=random.randint(1, 10),
                cargo_responsable_id=1, # Assuming a Cargo with id=1 exists
                fecha_hora=fake.date_time(),
                fecha_solicitud=fake.date_time(),
                codigo=fake.unique.ean(length=8),
                descripcion=fake.sentence(nb_words=4),
                administra=1,
                cuota_con_almuerzo=fake.random_number(digits=5),
                cuota_sin_almuerzo=fake.random_number(digits=5),
                modalidad=1,
                tipo_curso_enum=1,
                estado=1,
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with mock data.'))
