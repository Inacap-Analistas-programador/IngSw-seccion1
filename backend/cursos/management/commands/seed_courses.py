"""
Management command to seed the database with sample courses
Usage: python manage.py seed_courses
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from cursos.models import Curso, CursoFecha
from personas.models import Persona
from maestros.models import TipoCurso, Cargo
from usuarios.models import Usuario
from geografia.models import Comuna


class Command(BaseCommand):
    help = 'Seed database with sample courses for GIC platform'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clean',
            action='store_true',
            help='Delete all existing courses before seeding',
        )

    def handle(self, *args, **options):
        if options['clean']:
            self.stdout.write(self.style.WARNING('Cleaning existing courses...'))
            Curso.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Courses cleaned'))

        self.stdout.write('Starting course seeding...')

        # Get or create required objects
        try:
            # Get first admin user
            usuario = Usuario.objects.filter(is_staff=True).first()
            if not usuario:
                self.stdout.write(self.style.ERROR('No admin user found. Please create one first.'))
                return

            # Get or create TipoCurso
            tipo_curso, _ = TipoCurso.objects.get_or_create(
                tcu_descripcion='Curso General',
                defaults={'tcu_vigente': True}
            )

            # Get or create Cargo
            cargo, _ = Cargo.objects.get_or_create(
                car_descripcion='Instructor',
                defaults={'car_vigente': True}
            )

            # Get first persona as responsible
            persona = Persona.objects.first()
            if not persona:
                self.stdout.write(self.style.WARNING('No persona found. Creating default...'))
                persona = Persona.objects.create(
                    per_rut='11111111-1',
                    per_nombre='Instructor',
                    per_apellido_paterno='Principal',
                    per_apellido_materno='Sistema',
                    per_correo='instructor@gic.cl',
                    per_celular='912345678',
                    per_fecha_nacimiento=timezone.now().date() - timedelta(days=10000),
                    per_genero='M',
                    per_vigente=True
                )

            # Get first comuna
            comuna = Comuna.objects.first()

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error getting required objects: {e}'))
            return

        # Define course templates
        course_templates = [
            {
                'codigo': 'LID-001',
                'descripcion': 'Liderazgo y Gestión de Equipos',
                'observacion': 'Curso intensivo de liderazgo para profesionales',
                'cuota_con_almuerzo': Decimal('85000'),
                'cuota_sin_almuerzo': Decimal('65000'),
                'modalidad': 1,  # Presencial
                'tipo_curso': 1,
                'lugar': 'Centro de Capacitación Principal',
                'estado': 1,  # Activo
                'fecha_inicio_dias': 15,
                'duracion_dias': 3,
            },
            {
                'codigo': 'TEC-002',
                'descripcion': 'Gestión de Proyectos Ágiles',
                'observacion': 'Metodologías ágiles Scrum y Kanban',
                'cuota_con_almuerzo': Decimal('95000'),
                'cuota_sin_almuerzo': Decimal('75000'),
                'modalidad': 2,  # Online
                'tipo_curso': 1,
                'lugar': 'Plataforma Virtual',
                'estado': 1,  # Activo
                'fecha_inicio_dias': 20,
                'duracion_dias': 2,
            },
            {
                'codigo': 'COM-003',
                'descripcion': 'Comunicación Efectiva',
                'observacion': 'Técnicas de comunicación y oratoria',
                'cuota_con_almuerzo': Decimal('75000'),
                'cuota_sin_almuerzo': Decimal('55000'),
                'modalidad': 3,  # Híbrido
                'tipo_curso': 1,
                'lugar': 'Centro Regional de Formación',
                'estado': 1,  # Activo
                'fecha_inicio_dias': 25,
                'duracion_dias': 2,
            },
            {
                'codigo': 'GES-004',
                'descripcion': 'Gestión Estratégica',
                'observacion': 'Planificación estratégica y toma de decisiones',
                'cuota_con_almuerzo': Decimal('120000'),
                'cuota_sin_almuerzo': Decimal('100000'),
                'modalidad': 1,  # Presencial
                'tipo_curso': 1,
                'lugar': 'Sede Corporativa',
                'estado': 1,  # Activo
                'fecha_inicio_dias': 30,
                'duracion_dias': 4,
            },
            {
                'codigo': 'DIG-005',
                'descripcion': 'Transformación Digital',
                'observacion': 'Digitalización de procesos y cultura digital',
                'cuota_con_almuerzo': Decimal('110000'),
                'cuota_sin_almuerzo': Decimal('90000'),
                'modalidad': 2,  # Online
                'tipo_curso': 1,
                'lugar': 'Plataforma E-Learning',
                'estado': 2,  # Inscripción abierta
                'fecha_inicio_dias': 40,
                'duracion_dias': 3,
            },
            {
                'codigo': 'FIN-006',
                'descripcion': 'Finanzas para No Financieros',
                'observacion': 'Conceptos financieros básicos para la gestión',
                'cuota_con_almuerzo': Decimal('80000'),
                'cuota_sin_almuerzo': Decimal('60000'),
                'modalidad': 1,  # Presencial
                'tipo_curso': 1,
                'lugar': 'Centro de Negocios',
                'estado': 2,  # Inscripción abierta
                'fecha_inicio_dias': 35,
                'duracion_dias': 2,
            },
            {
                'codigo': 'INN-007',
                'descripcion': 'Innovación y Creatividad',
                'observacion': 'Técnicas de design thinking e innovación',
                'cuota_con_almuerzo': Decimal('90000'),
                'cuota_sin_almuerzo': Decimal('70000'),
                'modalidad': 3,  # Híbrido
                'tipo_curso': 1,
                'lugar': 'Hub de Innovación',
                'estado': 1,  # Activo
                'fecha_inicio_dias': 45,
                'duracion_dias': 3,
            },
            {
                'codigo': 'CAL-008',
                'descripcion': 'Gestión de Calidad',
                'observacion': 'Sistemas de gestión de calidad ISO 9001',
                'cuota_con_almuerzo': Decimal('100000'),
                'cuota_sin_almuerzo': Decimal('80000'),
                'modalidad': 1,  # Presencial
                'tipo_curso': 1,
                'lugar': 'Centro de Certificación',
                'estado': 1,  # Activo
                'fecha_inicio_dias': 50,
                'duracion_dias': 4,
            },
        ]

        # Create courses
        created_count = 0
        for template in course_templates:
            try:
                # Calculate dates
                fecha_inicio = timezone.now() + timedelta(days=template['fecha_inicio_dias'])
                fecha_termino = fecha_inicio + timedelta(days=template['duracion_dias'])
                
                # Create course
                curso = Curso.objects.create(
                    usu_id=usuario,
                    tcu_id=tipo_curso,
                    per_id_responsable=persona,
                    car_id_responsable=cargo,
                    com_id_lugar=comuna,
                    cur_fecha_solicitud=timezone.now(),
                    cur_codigo=template['codigo'],
                    cur_descripcion=template['descripcion'],
                    cur_observacion=template['observacion'],
                    cur_administra=1,
                    cur_cuota_con_almuerzo=template['cuota_con_almuerzo'],
                    cur_cuota_sin_almuerzo=template['cuota_sin_almuerzo'],
                    cur_modalidad=template['modalidad'],
                    cur_tipo_curso=template['tipo_curso'],
                    cur_lugar=template['lugar'],
                    cur_estado=template['estado'],
                )

                # Create course dates
                CursoFecha.objects.create(
                    cur_id=curso,
                    cuf_fecha_inicio=fecha_inicio,
                    cuf_fecha_termino=fecha_termino,
                    cuf_tipo=template['modalidad'],
                )

                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Created course: {curso.cur_codigo} - {curso.cur_descripcion}'
                    )
                )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'✗ Error creating course {template["codigo"]}: {e}'
                    )
                )

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} courses'))
        self.stdout.write(self.style.SUCCESS('Course seeding completed!'))
