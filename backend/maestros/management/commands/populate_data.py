import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from usuarios.models import Usuario
from maestros.models import (
    ConceptoContable, Region, Provincia, Comuna, Perfil, 
    EstadoCivil, Cargo, Nivel, Rama, Rol, TipoArchivo, TipoCurso, Alimentacion
)
from cursos.models import Curso
from personas.models import Persona
from proveedores.models import Proveedor
from pagos.models import PagoProveedor, Prepago, PagoPersona

class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data population...')

        # 1. Ensure Basic Maestros exist
        self.stdout.write('Creating Maestros...')
        region, _ = Region.objects.get_or_create(reg_id=1, defaults={'reg_descripcion': 'Metropolitana', 'reg_orden': 1})
        provincia, _ = Provincia.objects.get_or_create(prv_id=1, defaults={'prv_descripcion': 'Santiago', 'reg_id': region})
        comuna, _ = Comuna.objects.get_or_create(com_id=1, defaults={'com_descripcion': 'Santiago', 'prv_id': provincia})
        
        # Conceptos Contables
        conceptos_data = [
            ('Matrícula', 1), ('Mensualidad', 1), ('Donación', 1), 
            ('Materiales', 2), ('Servicios Básicos', 2), ('Transporte', 2)
        ]
        conceptos = []
        for desc, tipo in conceptos_data:
            c, _ = ConceptoContable.objects.get_or_create(
                coc_descripcion=desc, 
                defaults={'coc_tipo': tipo, 'coc_vigente': True}
            )
            conceptos.append(c)

        # 2. Ensure User exists
        user = User.objects.first()
        if not user:
            user = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        
        perfil, _ = Perfil.objects.get_or_create(pel_descripcion='Administrador', defaults={'pel_vigente': True})
        usuario, _ = Usuario.objects.get_or_create(
            usu_username='admin',
            defaults={'usu_email': 'admin@example.com', 'pel_id': perfil, 'usu_vigente': True}
        )

        # 3. Create Cursos
        self.stdout.write('Creating Cursos...')
        cursos_names = ['1° Básico A', '1° Básico B', '2° Básico A', '3° Medio A', '4° Medio B']
        cursos = []
        for name in cursos_names:
            c, _ = Curso.objects.get_or_create(
                cur_descripcion=name,
                defaults={'cur_codigo': name[:3].replace(' ', ''), 'cur_vigente': True}
            )
            cursos.append(c)

        # 4. Create Personas
        self.stdout.write('Creating Personas...')
        nombres = ['Juan', 'Maria', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Carlos', 'Elena', 'Diego', 'Valentina']
        apellidos = ['Perez', 'Gonzalez', 'Rodriguez', 'Lopez', 'Martinez', 'Silva', 'Rojas', 'Torres']
        
        personas = []
        for i in range(20):
            rut = 10000000 + i
            p, created = Persona.objects.get_or_create(
                per_run=rut,
                defaults={
                    'per_dv': str(rut % 11), # Dummy DV
                    'per_nombres': random.choice(nombres),
                    'per_apelpat': random.choice(apellidos),
                    'per_apelmat': random.choice(apellidos),
                    'per_fecha_nacimiento': date(2000, 1, 1),
                    'per_direccion': 'Calle Falsa 123',
                    'com_id': comuna,
                    'per_vigente': True
                }
            )
            personas.append(p)

        # 5. Create Proveedores
        self.stdout.write('Creating Proveedores...')
        proveedores_names = ['Librería Nacional', 'Transportes Juan', 'Servicios de Limpieza SA', 'Constructora Norte']
        proveedores = []
        for name in proveedores_names:
            prov, _ = Proveedor.objects.get_or_create(
                prv_descripcion=name,
                defaults={
                    'prv_celular1': '+56912345678',
                    'prv_direccion': 'Av. Principal 456',
                    'prv_vigente': True
                }
            )
            proveedores.append(prov)

        # 6. Create Pagos a Proveedores
        self.stdout.write('Creating Pagos a Proveedores...')
        for _ in range(10):
            PagoProveedor.objects.create(
                prv_id=random.choice(proveedores),
                usu_id=usuario,
                coc_id=random.choice(conceptos),
                ppr_fecha=date.today() - timedelta(days=random.randint(0, 30)),
                ppr_valor=random.randint(50000, 500000),
                ppr_observacion='Pago mensual de servicios'
            )

        # 7. Create Prepagos
        self.stdout.write('Creating Prepagos...')
        for _ in range(10):
            Prepago.objects.create(
                per_id=random.choice(personas),
                cur_id=random.choice(cursos),
                ppa_valor=random.randint(10000, 100000),
                ppa_observacion='Abono matrícula',
                ppa_vigente=True
            )

        # 8. Create Pagos Personas (Massive Payment Simulation)
        self.stdout.write('Creating Pagos Personas...')
        for _ in range(15):
            PagoPersona.objects.create(
                per_id=random.choice(personas),
                cur_id=random.choice(cursos),
                usu_id=usuario,
                pap_fecha_hora=timezone.now(),
                pap_tipo=1, # Ingreso
                pap_valor=random.randint(20000, 80000),
                pap_estado=1, # Pagado
                pap_observacion='Pago mensualidad'
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data'))
