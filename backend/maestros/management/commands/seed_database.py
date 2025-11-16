"""
Management command to populate the database with realistic seed data
Usage: python manage.py seed_database
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
import random

from maestros.models import (
    Aplicacion, Perfil, EstadoCivil, Cargo, Nivel, Rama, Rol,
    TipoArchivo, TipoCurso, Alimentacion, ConceptoContable
)
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from usuarios.models import Usuario
from personas.models import Persona, PersonaGrupo
from cursos.models import Curso, CursoSeccion, CursoFecha, CursoCuota
from preinscripcion.models import Preinscripcion


class Command(BaseCommand):
    help = 'Seed database with realistic data for all tables'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            self.clear_data()

        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))
        
        # Seed data in dependency order
        self.seed_aplicaciones()
        self.seed_perfiles()
        self.seed_estados_civiles()
        self.seed_cargos()
        self.seed_niveles()
        self.seed_ramas()
        self.seed_roles()
        self.seed_tipos_archivo()
        self.seed_tipos_curso()
        self.seed_alimentaciones()
        self.seed_conceptos_contables()
        
        # Geografia
        self.seed_regiones()
        self.seed_provincias()
        self.seed_comunas()
        self.seed_zonas()
        self.seed_distritos()
        self.seed_grupos()
        
        # Usuarios y Personas
        self.seed_usuarios()
        self.seed_personas()
        self.seed_persona_grupo()
        
        # Cursos
        self.seed_cursos()
        self.seed_curso_secciones()
        self.seed_curso_fechas()
        self.seed_curso_cuotas()
        
        # Preinscripciones
        self.seed_preinscripciones()
        
        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))

    def clear_data(self):
        """Clear existing data from all tables"""
        models_to_clear = [
            Preinscripcion, CursoCuota, CursoFecha, CursoSeccion, Curso,
            PersonaGrupo, Persona, Grupo, Distrito, Zona, Comuna, Provincia,
            Region, Usuario, ConceptoContable, Alimentacion, TipoCurso,
            TipoArchivo, Rol, Rama, Nivel, Cargo, EstadoCivil, Perfil, Aplicacion
        ]
        for model in models_to_clear:
            model.objects.all().delete()

    def seed_aplicaciones(self):
        aplicaciones = [
            {'apl_descripcion': 'Sistema GIC', 'apl_vigente': True},
            {'apl_descripcion': 'Portal Web', 'apl_vigente': True},
            {'apl_descripcion': 'App Móvil', 'apl_vigente': False},
        ]
        for data in aplicaciones:
            Aplicacion.objects.get_or_create(**data)
        self.stdout.write('✓ Aplicaciones seeded')

    def seed_perfiles(self):
        perfiles = [
            {'pel_descripcion': 'Administrador', 'pel_vigente': True},
            {'pel_descripcion': 'Coordinador', 'pel_vigente': True},
            {'pel_descripcion': 'Dirigente', 'pel_vigente': True},
            {'pel_descripcion': 'Formador', 'pel_vigente': True},
            {'pel_descripcion': 'Participante', 'pel_vigente': True},
        ]
        for data in perfiles:
            Perfil.objects.get_or_create(**data)
        self.stdout.write('✓ Perfiles seeded')

    def seed_estados_civiles(self):
        estados = [
            {'esc_descripcion': 'Soltero/a', 'esc_vigente': True},
            {'esc_descripcion': 'Casado/a', 'esc_vigente': True},
            {'esc_descripcion': 'Divorciado/a', 'esc_vigente': True},
            {'esc_descripcion': 'Viudo/a', 'esc_vigente': True},
            {'esc_descripcion': 'Conviviente', 'esc_vigente': True},
        ]
        for data in estados:
            EstadoCivil.objects.get_or_create(**data)
        self.stdout.write('✓ Estados civiles seeded')

    def seed_cargos(self):
        cargos = [
            {'car_descripcion': 'Dirigente de Grupo', 'car_vigente': True},
            {'car_descripcion': 'Coordinador Zonal', 'car_vigente': True},
            {'car_descripcion': 'Coordinador Distrital', 'car_vigente': True},
            {'car_descripcion': 'Formador', 'car_vigente': True},
            {'car_descripcion': 'Participante', 'car_vigente': True},
            {'car_descripcion': 'Jefe de Rama', 'car_vigente': True},
        ]
        for data in cargos:
            Cargo.objects.get_or_create(**data)
        self.stdout.write('✓ Cargos seeded')

    def seed_niveles(self):
        niveles = [
            {'niv_descripcion': 'Básico', 'niv_orden': 1, 'niv_vigente': True},
            {'niv_descripcion': 'Intermedio', 'niv_orden': 2, 'niv_vigente': True},
            {'niv_descripcion': 'Avanzado', 'niv_orden': 3, 'niv_vigente': True},
            {'niv_descripcion': 'Formador', 'niv_orden': 4, 'niv_vigente': True},
        ]
        for data in niveles:
            Nivel.objects.get_or_create(**data)
        self.stdout.write('✓ Niveles seeded')

    def seed_ramas(self):
        ramas = [
            {'ram_descripcion': 'Manada (Lobatos)', 'ram_vigente': True},
            {'ram_descripcion': 'Unidad (Scouts)', 'ram_vigente': True},
            {'ram_descripcion': 'Comunidad (Pioneros)', 'ram_vigente': True},
            {'ram_descripcion': 'Rover (Rovers)', 'ram_vigente': True},
        ]
        for data in ramas:
            Rama.objects.get_or_create(**data)
        self.stdout.write('✓ Ramas seeded')

    def seed_roles(self):
        roles = [
            {'rol_descripcion': 'Participante', 'rol_tipo': 1, 'rol_vigente': True},
            {'rol_descripcion': 'Formador', 'rol_tipo': 2, 'rol_vigente': True},
            {'rol_descripcion': 'Coordinador', 'rol_tipo': 3, 'rol_vigente': True},
            {'rol_descripcion': 'Observador', 'rol_tipo': 4, 'rol_vigente': True},
        ]
        for data in roles:
            Rol.objects.get_or_create(**data)
        self.stdout.write('✓ Roles seeded')

    def seed_tipos_archivo(self):
        tipos = [
            {'tar_descripcion': 'Certificado', 'tar_vigente': True},
            {'tar_descripcion': 'Comprobante de Pago', 'tar_vigente': True},
            {'tar_descripcion': 'Foto de Perfil', 'tar_vigente': True},
            {'tar_descripcion': 'Documento de Identidad', 'tar_vigente': True},
            {'tar_descripcion': 'Ficha Médica', 'tar_vigente': True},
        ]
        for data in tipos:
            TipoArchivo.objects.get_or_create(**data)
        self.stdout.write('✓ Tipos de archivo seeded')

    def seed_tipos_curso(self):
        tipos = [
            {
                'tcu_descripcion': 'Formación Básica Scout',
                'tcu_tipo': 1,
                'tcu_cant_participante': 30,
                'tcu_vigente': True
            },
            {
                'tcu_descripcion': 'Curso de Liderazgo',
                'tcu_tipo': 2,
                'tcu_cant_participante': 25,
                'tcu_vigente': True
            },
            {
                'tcu_descripcion': 'Especialidades Scout',
                'tcu_tipo': 3,
                'tcu_cant_participante': 20,
                'tcu_vigente': True
            },
            {
                'tcu_descripcion': 'Formador de Formadores',
                'tcu_tipo': 4,
                'tcu_cant_participante': 15,
                'tcu_vigente': True
            },
        ]
        for data in tipos:
            TipoCurso.objects.get_or_create(**data)
        self.stdout.write('✓ Tipos de curso seeded')

    def seed_alimentaciones(self):
        alimentaciones = [
            {'ali_descripcion': 'Con Almuerzo', 'ali_tipo': 1, 'ali_vigente': True},
            {'ali_descripcion': 'Sin Almuerzo', 'ali_tipo': 2, 'ali_vigente': True},
            {'ali_descripcion': 'Vegetariana', 'ali_tipo': 3, 'ali_vigente': True},
            {'ali_descripcion': 'Vegana', 'ali_tipo': 4, 'ali_vigente': True},
            {'ali_descripcion': 'Sin Gluten', 'ali_tipo': 5, 'ali_vigente': True},
        ]
        for data in alimentaciones:
            Alimentacion.objects.get_or_create(**data)
        self.stdout.write('✓ Alimentaciones seeded')

    def seed_conceptos_contables(self):
        conceptos = [
            {'coc_descripcion': 'Matrícula', 'coc_vigente': True},
            {'coc_descripcion': 'Mensualidad', 'coc_vigente': True},
            {'coc_descripcion': 'Material del Curso', 'coc_vigente': True},
            {'coc_descripcion': 'Certificación', 'coc_vigente': True},
            {'coc_descripcion': 'Alimentación', 'coc_vigente': True},
        ]
        for data in conceptos:
            ConceptoContable.objects.get_or_create(**data)
        self.stdout.write('✓ Conceptos contables seeded')

    def seed_regiones(self):
        regiones = [
            'Región de Tarapacá',
            'Región de Antofagasta',
            'Región de Atacama',
            'Región de Coquimbo',
            'Región de Valparaíso',
            'Región Metropolitana',
            'Región del Libertador Gral. Bernardo O\'Higgins',
            'Región del Maule',
            'Región de Ñuble',
            'Región del Biobío',
            'Región de La Araucanía',
            'Región de Los Ríos',
            'Región de Los Lagos',
            'Región de Aysén',
            'Región de Magallanes',
        ]
        for nombre in regiones:
            Region.objects.get_or_create(
                reg_descripcion=nombre,
                defaults={'reg_vigente': True}
            )
        self.stdout.write('✓ Regiones seeded')

    def seed_provincias(self):
        # Sample provinces for Región Metropolitana
        region_rm = Region.objects.get(reg_descripcion='Región Metropolitana')
        provincias = [
            'Santiago',
            'Cordillera',
            'Chacabuco',
            'Maipo',
            'Melipilla',
            'Talagante',
        ]
        for nombre in provincias:
            Provincia.objects.get_or_create(
                reg_id=region_rm,
                pro_descripcion=nombre,
                defaults={'pro_vigente': True}
            )
        self.stdout.write('✓ Provincias seeded')

    def seed_comunas(self):
        # Sample comunas for Santiago province
        provincia_stgo = Provincia.objects.get(pro_descripcion='Santiago')
        comunas = [
            'Santiago Centro',
            'Providencia',
            'Las Condes',
            'Ñuñoa',
            'La Reina',
            'Maipú',
            'Peñalolén',
            'La Florida',
            'Puente Alto',
            'San Miguel',
        ]
        for nombre in comunas:
            Comuna.objects.get_or_create(
                pro_id=provincia_stgo,
                com_descripcion=nombre,
                defaults={'com_vigente': True}
            )
        self.stdout.write('✓ Comunas seeded')

    def seed_zonas(self):
        zonas = [
            {'zon_descripcion': 'Zona Norte', 'zon_unilateral': False, 'zon_vigente': True},
            {'zon_descripcion': 'Zona Centro', 'zon_unilateral': False, 'zon_vigente': True},
            {'zon_descripcion': 'Zona Sur', 'zon_unilateral': False, 'zon_vigente': True},
            {'zon_descripcion': 'Zona Oriente', 'zon_unilateral': True, 'zon_vigente': True},
        ]
        for data in zonas:
            Zona.objects.get_or_create(**data)
        self.stdout.write('✓ Zonas seeded')

    def seed_distritos(self):
        zona_centro = Zona.objects.get(zon_descripcion='Zona Centro')
        distritos = [
            'Distrito Santiago',
            'Distrito Providencia',
            'Distrito Maipú',
            'Distrito La Florida',
        ]
        for nombre in distritos:
            Distrito.objects.get_or_create(
                zon_id=zona_centro,
                dis_descripcion=nombre,
                defaults={'dis_vigente': True}
            )
        self.stdout.write('✓ Distritos seeded')

    def seed_grupos(self):
        distrito_stgo = Distrito.objects.get(dis_descripcion='Distrito Santiago')
        grupos = [
            'Grupo Scout San Jorge',
            'Grupo Scout Santa María',
            'Grupo Scout Montaña',
            'Grupo Scout Aventura',
            'Grupo Scout Los Andes',
        ]
        for nombre in grupos:
            Grupo.objects.get_or_create(
                dis_id=distrito_stgo,
                gru_descripcion=nombre,
                defaults={'gru_vigente': True}
            )
        self.stdout.write('✓ Grupos seeded')

    def seed_usuarios(self):
        perfiles = {
            'admin': Perfil.objects.get(pel_descripcion='Administrador'),
            'coord': Perfil.objects.get(pel_descripcion='Coordinador'),
            'dirig': Perfil.objects.get(pel_descripcion='Dirigente'),
        }
        
        usuarios_data = [
            {
                'usu_username': 'admin',
                'usu_email': 'admin@scouts.cl',
                'password': 'Admin123!',
                'pel_id': perfiles['admin'],
            },
            {
                'usu_username': 'coordinador',
                'usu_email': 'coordinador@scouts.cl',
                'password': 'Coord123!',
                'pel_id': perfiles['coord'],
            },
            {
                'usu_username': 'dirigente',
                'usu_email': 'dirigente@scouts.cl',
                'password': 'Dirig123!',
                'pel_id': perfiles['dirig'],
            },
        ]
        
        for data in usuarios_data:
            password = data.pop('password')
            usuario, created = Usuario.objects.get_or_create(
                usu_username=data['usu_username'],
                defaults={**data, 'usu_vigente': True}
            )
            if created:
                usuario.set_password(password)
                usuario.save()
        
        self.stdout.write('✓ Usuarios seeded')

    def seed_personas(self):
        estado_civil = EstadoCivil.objects.first()
        comuna = Comuna.objects.first()
        usuario = Usuario.objects.first()
        
        personas_data = [
            {
                'per_run': 12345678,
                'per_dv': '9',
                'per_apelpat': 'Pérez',
                'per_apelmat': 'González',
                'per_nombres': 'Juan',
                'per_email': 'juan.perez@scouts.cl',
                'per_fecha_nac': timezone.make_aware(datetime(1995, 5, 15)),
                'per_direccion': 'Av. Libertador 123',
                'per_tipo_fono': 1,
                'per_fono': '+56912345678',
                'per_apodo': 'Juanito',
            },
            {
                'per_run': 23456789,
                'per_dv': '0',
                'per_apelpat': 'Silva',
                'per_apelmat': 'Rodríguez',
                'per_nombres': 'María',
                'per_email': 'maria.silva@scouts.cl',
                'per_fecha_nac': timezone.make_aware(datetime(1998, 8, 20)),
                'per_direccion': 'Calle Principal 456',
                'per_tipo_fono': 1,
                'per_fono': '+56923456789',
                'per_apodo': 'Mary',
            },
            {
                'per_run': 34567890,
                'per_dv': '1',
                'per_apelpat': 'Muñoz',
                'per_apelmat': 'López',
                'per_nombres': 'Carlos',
                'per_email': 'carlos.munoz@scouts.cl',
                'per_fecha_nac': timezone.make_aware(datetime(2000, 3, 10)),
                'per_direccion': 'Pasaje Los Pinos 789',
                'per_tipo_fono': 1,
                'per_fono': '+56934567890',
                'per_apodo': 'Carlitos',
            },
        ]
        
        for data in personas_data:
            Persona.objects.get_or_create(
                per_run=data['per_run'],
                defaults={
                    **data,
                    'esc_id': estado_civil,
                    'com_id': comuna,
                    'usu_id': usuario,
                    'per_vigente': True,
                }
            )
        
        self.stdout.write('✓ Personas seeded')

    def seed_persona_grupo(self):
        personas = Persona.objects.all()[:3]
        grupos = Grupo.objects.all()[:3]
        
        for persona, grupo in zip(personas, grupos):
            PersonaGrupo.objects.get_or_create(
                per_id=persona,
                gru_id=grupo,
                defaults={'peg_vigente': True}
            )
        
        self.stdout.write('✓ PersonaGrupo seeded')

    def seed_cursos(self):
        usuario = Usuario.objects.first()
        tipo_curso = TipoCurso.objects.first()
        persona = Persona.objects.first()
        cargo = Cargo.objects.first()
        comuna = Comuna.objects.first()
        
        cursos_data = [
            {
                'cur_codigo': 'FB-2024-01',
                'cur_descripcion': 'Formación Básica Scout 2024',
                'cur_administra': 1,
                'cur_cuota_con_almuerzo': Decimal('50000.00'),
                'cur_cuota_sin_almuerzo': Decimal('35000.00'),
                'cur_modalidad': 1,
                'cur_tipo_curso': 1,
                'cur_lugar': 'Campo Scout Los Andes',
                'cur_estado': 1,
                'cur_fecha_solicitud': timezone.now(),
            },
            {
                'cur_codigo': 'LID-2024-01',
                'cur_descripcion': 'Curso de Liderazgo 2024',
                'cur_administra': 1,
                'cur_cuota_con_almuerzo': Decimal('60000.00'),
                'cur_cuota_sin_almuerzo': Decimal('45000.00'),
                'cur_modalidad': 1,
                'cur_tipo_curso': 2,
                'cur_lugar': 'Centro de Formación Scout',
                'cur_estado': 1,
                'cur_fecha_solicitud': timezone.now(),
            },
        ]
        
        for data in cursos_data:
            Curso.objects.get_or_create(
                cur_codigo=data['cur_codigo'],
                defaults={
                    **data,
                    'usu_id': usuario,
                    'tcu_id': tipo_curso,
                    'per_id_responsable': persona,
                    'car_id_responsable': cargo,
                    'com_id_lugar': comuna,
                }
            )
        
        self.stdout.write('✓ Cursos seeded')

    def seed_curso_secciones(self):
        cursos = Curso.objects.all()
        rama = Rama.objects.first()
        
        for curso in cursos:
            CursoSeccion.objects.get_or_create(
                cur_id=curso,
                cus_seccion=1,
                defaults={
                    'ram_id': rama,
                    'cus_cant_participante': 30,
                }
            )
        
        self.stdout.write('✓ Curso secciones seeded')

    def seed_curso_fechas(self):
        cursos = Curso.objects.all()
        
        for curso in cursos:
            inicio = timezone.now() + timedelta(days=30)
            fin = inicio + timedelta(days=2)
            
            CursoFecha.objects.get_or_create(
                cur_id=curso,
                cuf_tipo=1,
                defaults={
                    'cuf_fecha_inicio': inicio,
                    'cuf_fecha_termino': fin,
                }
            )
        
        self.stdout.write('✓ Curso fechas seeded')

    def seed_curso_cuotas(self):
        cursos = Curso.objects.all()
        
        for curso in cursos:
            # Cuota con almuerzo
            CursoCuota.objects.get_or_create(
                cur_id=curso,
                cuu_tipo=1,
                defaults={
                    'cuu_fecha': timezone.now() + timedelta(days=15),
                    'cuu_valor': curso.cur_cuota_con_almuerzo,
                }
            )
            # Cuota sin almuerzo
            CursoCuota.objects.get_or_create(
                cur_id=curso,
                cuu_tipo=2,
                defaults={
                    'cuu_fecha': timezone.now() + timedelta(days=15),
                    'cuu_valor': curso.cur_cuota_sin_almuerzo,
                }
            )
        
        self.stdout.write('✓ Curso cuotas seeded')

    def seed_preinscripciones(self):
        personas = Persona.objects.all()[:3]
        cursos = Curso.objects.all()[:2]
        rama = Rama.objects.first()
        grupo = Grupo.objects.first()
        
        estados = ['enviado', 'en_revision_grupo', 'validado']
        
        for i, persona in enumerate(personas):
            for curso in cursos:
                # Avoid duplicate preinscripciones
                if not Preinscripcion.objects.filter(persona=persona, curso=curso).exists():
                    Preinscripcion.objects.create(
                        persona=persona,
                        curso=curso,
                        estado=estados[i % len(estados)],
                        rama=rama,
                        grupo_asignado=grupo,
                        cuota_asignada='Con Almuerzo',
                    )
        
        self.stdout.write('✓ Preinscripciones seeded')
