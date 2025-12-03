import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from usuarios.models import Usuario
from maestros.models import (
    ConceptoContable, Perfil, 
    EstadoCivil, Cargo, Nivel, Rama, Rol, TipoArchivo, TipoCurso, Alimentacion
)
from geografia.models import Region, Provincia, Comuna
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
        region, _ = Region.objects.get_or_create(reg_id=1, defaults={'reg_descripcion': 'Metropolitana', 'reg_vigente': True})
        provincia, _ = Provincia.objects.get_or_create(pro_id=1, defaults={'pro_descripcion': 'Santiago', 'reg_id': region, 'pro_vigente': True})
        comuna, _ = Comuna.objects.get_or_create(com_id=1, defaults={'com_descripcion': 'Santiago', 'pro_id': provincia, 'com_vigente': True})
        
        # Conceptos Contables
        conceptos_data = [
            'Matrícula', 'Mensualidad', 'Donación', 
            'Materiales', 'Servicios Básicos', 'Transporte'
        ]
        conceptos = []
        for desc in conceptos_data:
            c, _ = ConceptoContable.objects.get_or_create(
                coc_descripcion=desc, 
                defaults={'coc_vigente': True}
            )
            conceptos.append(c)

        # 2. Ensure User exists
        perfil, _ = Perfil.objects.get_or_create(pel_descripcion='Administrador', defaults={'pel_vigente': True})
        
        usuario = Usuario.objects.filter(usu_username='admin').first()
        if not usuario:
            usuario = Usuario(
                usu_username='admin',
                usu_email='admin@example.com',
                pel_id=perfil,
                usu_vigente=True
            )
            usuario.set_password('admin123')
            usuario.save()

        # 3. Create Dependencies for Curso
        self.stdout.write('Creating Curso Dependencies...')
        tipo_curso, _ = TipoCurso.objects.get_or_create(
            tcu_descripcion='Presencial',
            defaults={'tcu_tipo': 1, 'tcu_vigente': True}
        )
        cargo, _ = Cargo.objects.get_or_create(
            car_descripcion='Coordinador',
            defaults={'car_vigente': True}
        )
        
        # Create a dummy responsible person first
        estado_civil, _ = EstadoCivil.objects.get_or_create(esc_descripcion='Soltero', defaults={'esc_vigente': True})
        
        responsable, _ = Persona.objects.get_or_create(
            per_run=99999999,
            defaults={
                'per_dv': '9',
                'per_nombres': 'Responsable',
                'per_apelpat': 'Curso',
                'per_email': 'resp@curso.com',
                'per_vigente': True,
                'esc_id': estado_civil,
                'com_id': comuna,
                'usu_id': usuario,
                'per_fecha_nac': date(1980, 1, 1),
                'per_direccion': 'Direccion Falsa 123',
                'per_tipo_fono': 1,
                'per_fono': '912345678',
                'per_apodo': 'Resp'
            }
        )

        # 4. Create Cursos
        self.stdout.write('Creating Cursos...')
        cursos_names = ['1° Básico A', '1° Básico B', '2° Básico A', '3° Medio A', '4° Medio B']
        cursos = []
        for name in cursos_names:
            c, _ = Curso.objects.get_or_create(
                cur_codigo=name[:3].replace(' ', ''),
                defaults={
                    'cur_descripcion': name,
                    'usu_id': usuario,
                    'tcu_id': tipo_curso,
                    'per_id_responsable': responsable,
                    'car_id_responsable': cargo,
                    'cur_fecha_solicitud': timezone.now(),
                    'cur_administra': 1,
                    'cur_cuota_con_almuerzo': 50000,
                    'cur_cuota_sin_almuerzo': 45000,
                    'cur_modalidad': 1,
                    'cur_tipo_curso': 1,
                    'cur_estado': 1
                }
            )
            cursos.append(c)

        # 5. Create Personas (Students)
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
                    'per_fecha_nac': date(2000, 1, 1),
                    'per_direccion': 'Calle Falsa 123',
                    'com_id': comuna,
                    'per_vigente': True,
                    'esc_id': estado_civil,
                    'usu_id': usuario,
                    'per_tipo_fono': 1,
                    'per_fono': '912345678',
                    'per_apodo': 'Estudiante'
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
