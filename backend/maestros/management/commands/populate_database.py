from django.core.management.base import BaseCommand
from django.db import transaction
from datetime import datetime, timedelta
from decimal import Decimal
import random

from maestros.models import (
    EstadoCivil, Cargo, Nivel, Rama, Rol, TipoArchivo, 
    TipoCurso, Alimentacion, ConceptoContable, Aplicacion, Perfil
)
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from usuarios.models import Usuario
from personas.models import (
    Persona, PersonaGrupo, PersonaNivel, PersonaFormador, 
    PersonaIndividual, PersonaCurso, PersonaEstadoCurso
)
from cursos.models import (
    Curso, CursoSeccion, CursoFecha, CursoCuota, 
    CursoAlimentacion, CursoCoordinador, CursoFormador
)
from pagos.models import PagoPersona, ComprobantePago, PagoComprobante
from proveedores.models import Proveedor


class Command(BaseCommand):
    help = 'Populate database with comprehensive sample data for GIC platform'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        
        try:
            with transaction.atomic():
                # 1. Master data
                self.stdout.write('Populating master tables...')
                self.populate_estado_civil()
                self.populate_cargo()
                self.populate_nivel()
                self.populate_rama()
                self.populate_rol()
                self.populate_tipo_archivo()
                self.populate_tipo_curso()
                self.populate_alimentacion()
                self.populate_concepto_contable()
                self.populate_aplicacion()
                self.populate_perfil()
                
                # 2. Geographic data
                self.stdout.write('Populating geographic data...')
                self.populate_geography()
                
                # 3. Organizational structure
                self.stdout.write('Populating organizational structure...')
                self.populate_zones_districts_groups()
                
                # 4. Providers
                self.stdout.write('Populating providers...')
                self.populate_proveedores()
                
                # 5. People
                self.stdout.write('Populating people...')
                self.populate_personas()
                
                # 6. Courses
                self.stdout.write('Populating courses...')
                self.populate_cursos()
                
                # 7. Payments
                self.stdout.write('Populating payments...')
                self.populate_pagos()
                
                self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
                self.print_statistics()
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error populating database: {str(e)}'))
            raise

    def populate_estado_civil(self):
        estados = [
            'Soltero/a',
            'Casado/a',
            'Divorciado/a',
            'Viudo/a',
            'Conviviente',
        ]
        for estado in estados:
            EstadoCivil.objects.get_or_create(
                esc_descripcion=estado,
                defaults={'esc_vigente': True}
            )

    def populate_cargo(self):
        cargos = [
            'Dirigente Scout',
            'Coordinador Regional',
            'Coordinador de Zona',
            'Coordinador de Distrito',
            'Jefe de Grupo',
            'Subjefe de Grupo',
            'Dirigente de Unidad',
            'Formador',
            'Responsable de Formación',
            'Tesorero',
        ]
        for cargo in cargos:
            Cargo.objects.get_or_create(
                car_descripcion=cargo,
                defaults={'car_vigente': True}
            )

    def populate_nivel(self):
        niveles = [
            ('Básico', 1),
            ('Intermedio', 2),
            ('Avanzado', 3),
            ('Especializado', 4),
        ]
        for descripcion, orden in niveles:
            Nivel.objects.get_or_create(
                niv_descripcion=descripcion,
                defaults={'niv_orden': orden, 'niv_vigente': True}
            )

    def populate_rama(self):
        ramas = [
            'Manada (7-10 años)',
            'Unidad Scout (11-14 años)',
            'Comunidad Caminantes (15-17 años)',
            'Comunidad Rover (18-21 años)',
        ]
        for rama in ramas:
            Rama.objects.get_or_create(
                ram_descripcion=rama,
                defaults={'ram_vigente': True}
            )

    def populate_rol(self):
        roles = [
            ('Participante', 1),
            ('Formador', 2),
            ('Coordinador', 3),
            ('Director', 4),
            ('Staff', 5),
        ]
        for descripcion, tipo in roles:
            Rol.objects.get_or_create(
                rol_descripcion=descripcion,
                defaults={'rol_tipo': tipo, 'rol_vigente': True}
            )

    def populate_tipo_archivo(self):
        tipos = [
            'Certificado',
            'Documento de Identidad',
            'Foto',
            'Comprobante de Pago',
            'Material Didáctico',
            'Formulario',
        ]
        for tipo in tipos:
            TipoArchivo.objects.get_or_create(
                tar_descripcion=tipo,
                defaults={'tar_vigente': True}
            )

    def populate_tipo_curso(self):
        tipos = [
            ('Formación Inicial', 1, 30),
            ('Formación Intermedia', 2, 25),
            ('Formación Avanzada', 3, 20),
            ('Especialización', 4, 15),
            ('Actualización', 5, 40),
        ]
        for descripcion, tipo, cant in tipos:
            TipoCurso.objects.get_or_create(
                tcu_descripcion=descripcion,
                defaults={
                    'tcu_tipo': tipo,
                    'tcu_cant_participante': cant,
                    'tcu_vigente': True
                }
            )

    def populate_alimentacion(self):
        alimentaciones = [
            ('Con Almuerzo', 1),
            ('Sin Almuerzo', 2),
            ('Vegetariana', 3),
            ('Vegana', 4),
            ('Celíaco', 5),
        ]
        for descripcion, tipo in alimentaciones:
            Alimentacion.objects.get_or_create(
                ali_descripcion=descripcion,
                defaults={'ali_tipo': tipo, 'ali_vigente': True}
            )

    def populate_concepto_contable(self):
        conceptos = [
            'Inscripción Curso',
            'Material Didáctico',
            'Alimentación',
            'Transporte',
            'Alojamiento',
            'Certificación',
        ]
        for concepto in conceptos:
            ConceptoContable.objects.get_or_create(
                coc_descripcion=concepto,
                defaults={'coc_vigente': True}
            )

    def populate_aplicacion(self):
        aplicaciones = [
            'GIC - Gestión de Cursos',
            'GIC - Módulo Finanzas',
            'GIC - Módulo Reportes',
        ]
        for app in aplicaciones:
            Aplicacion.objects.get_or_create(
                apl_descripcion=app,
                defaults={'apl_vigente': True}
            )

    def populate_perfil(self):
        perfiles = [
            'Administrador',
            'Coordinador',
            'Dirigente',
            'Usuario',
        ]
        for perfil in perfiles:
            Perfil.objects.get_or_create(
                pel_descripcion=perfil,
                defaults={'pel_vigente': True}
            )

    def populate_geography(self):
        # Regions of Chile
        regiones_data = [
            ('Región de Arica y Parinacota', [
                ('Arica', ['Arica', 'Camarones']),
                ('Parinacota', ['Putre', 'General Lagos']),
            ]),
            ('Región de Tarapacá', [
                ('Iquique', ['Iquique', 'Alto Hospicio']),
                ('Tamarugal', ['Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica']),
            ]),
            ('Región Metropolitana de Santiago', [
                ('Santiago', ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 
                             'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna',
                             'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes',
                             'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú',
                             'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia',
                             'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta',
                             'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura']),
                ('Cordillera', ['Puente Alto', 'Pirque', 'San José de Maipo']),
                ('Maipo', ['Buin', 'Calera de Tango', 'Paine', 'San Bernardo']),
                ('Melipilla', ['Alhué', 'Curacaví', 'María Pinto', 'Melipilla', 'San Pedro']),
                ('Talagante', ['El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor', 'Talagante']),
            ]),
            ('Región de Valparaíso', [
                ('Valparaíso', ['Valparaíso', 'Viña del Mar', 'Concón', 'Quintero', 'Puchuncaví']),
                ('Quillota', ['Quillota', 'La Calera', 'Hijuelas', 'La Cruz', 'Nogales']),
            ]),
            ('Región del Biobío', [
                ('Concepción', ['Concepción', 'Talcahuano', 'Hualpén', 'Chiguayante', 'San Pedro de la Paz']),
                ('Biobío', ['Los Ángeles', 'Cabrero', 'Tucapel', 'Antuco']),
            ]),
        ]

        for reg_desc, provincias in regiones_data:
            region, _ = Region.objects.get_or_create(
                reg_descripcion=reg_desc,
                defaults={'reg_vigente': True}
            )
            
            for prov_desc, comunas in provincias:
                provincia, _ = Provincia.objects.get_or_create(
                    pro_descripcion=prov_desc,
                    reg_id=region,
                    defaults={'pro_vigente': True}
                )
                
                for com_desc in comunas:
                    Comuna.objects.get_or_create(
                        com_descripcion=com_desc,
                        pro_id=provincia,
                        defaults={'com_vigente': True}
                    )

    def populate_zones_districts_groups(self):
        zonas_data = [
            ('Zona Norte', False, [
                ('Distrito Arica', ['Grupo Scout Arica 1', 'Grupo Scout Iquique 1']),
            ]),
            ('Zona Centro', False, [
                ('Distrito Santiago Centro', [
                    'Grupo Scout Providencia 1',
                    'Grupo Scout Las Condes 1',
                    'Grupo Scout Ñuñoa 1',
                    'Grupo Scout La Reina 1',
                ]),
                ('Distrito Santiago Sur', [
                    'Grupo Scout La Florida 1',
                    'Grupo Scout Puente Alto 1',
                    'Grupo Scout Maipú 1',
                ]),
            ]),
            ('Zona Valparaíso', False, [
                ('Distrito Valparaíso', [
                    'Grupo Scout Valparaíso 1',
                    'Grupo Scout Viña del Mar 1',
                ]),
            ]),
            ('Zona Sur', False, [
                ('Distrito Concepción', [
                    'Grupo Scout Concepción 1',
                    'Grupo Scout Los Ángeles 1',
                ]),
            ]),
        ]

        for zona_desc, unilateral, distritos in zonas_data:
            zona, _ = Zona.objects.get_or_create(
                zon_descripcion=zona_desc,
                defaults={'zon_unilateral': unilateral, 'zon_vigente': True}
            )
            
            for distrito_desc, grupos in distritos:
                distrito, _ = Distrito.objects.get_or_create(
                    dis_descripcion=distrito_desc,
                    zon_id=zona,
                    defaults={'dis_vigente': True}
                )
                
                for grupo_desc in grupos:
                    Grupo.objects.get_or_create(
                        gru_descripcion=grupo_desc,
                        dis_id=distrito,
                        defaults={'gru_vigente': True}
                    )

    def populate_proveedores(self):
        proveedores_data = [
            ('Proveedor Alimentación Centro', '+56912345678', 'Providencia 123, Santiago'),
            ('Proveedor Materiales Didácticos', '+56923456789', 'Las Condes 456, Santiago'),
            ('Proveedor Alojamiento Sur', '+56934567890', 'Concepción 789, Concepción'),
        ]
        
        for nombre, celular, direccion in proveedores_data:
            Proveedor.objects.get_or_create(
                prv_descripcion=nombre,
                defaults={
                    'prv_celular1': celular,
                    'prv_direccion': direccion,
                    'prv_vigente': True
                }
            )

    def populate_personas(self):
        # Get required foreign keys
        usuarios = list(Usuario.objects.all())
        if not usuarios:
            self.stdout.write(self.style.WARNING('No users found, skipping personas'))
            return
            
        estados_civil = list(EstadoCivil.objects.all())
        comunas = list(Comuna.objects.all())
        grupos = list(Grupo.objects.all())
        cargos = list(Cargo.objects.all())
        
        if not all([estados_civil, comunas, grupos, cargos]):
            self.stdout.write(self.style.WARNING('Missing master data, skipping personas'))
            return

        nombres = [
            ('Juan', 'González', 'Pérez'),
            ('María', 'Rodríguez', 'López'),
            ('Pedro', 'Martínez', 'García'),
            ('Ana', 'Fernández', 'Sánchez'),
            ('Carlos', 'López', 'Martínez'),
            ('Sofía', 'García', 'Rodríguez'),
            ('Diego', 'Hernández', 'Fernández'),
            ('Valentina', 'Torres', 'González'),
            ('Matías', 'Silva', 'Muñoz'),
            ('Javiera', 'Muñoz', 'Silva'),
            ('Sebastián', 'Rojas', 'Torres'),
            ('Catalina', 'Morales', 'Rojas'),
            ('Benjamín', 'Díaz', 'Morales'),
            ('Isidora', 'Vargas', 'Díaz'),
            ('Vicente', 'Castro', 'Vargas'),
        ]

        personas_creadas = []
        for i, (nombre, apelpat, apelmat) in enumerate(nombres):
            run = 12000000 + i * 100000 + random.randint(1, 99999)
            dv = str(random.randint(0, 9)) if random.random() > 0.1 else 'K'
            
            persona, created = Persona.objects.get_or_create(
                per_run=run,
                per_dv=dv,
                defaults={
                    'esc_id': random.choice(estados_civil),
                    'com_id': random.choice(comunas),
                    'usu_id': random.choice(usuarios),
                    'per_apelpat': apelpat,
                    'per_apelmat': apelmat,
                    'per_nombres': nombre,
                    'per_email': f'{nombre.lower()}.{apelpat.lower()}@scouts.cl',
                    'per_fecha_nac': datetime.now() - timedelta(days=random.randint(7300, 18250)),
                    'per_direccion': f'Calle {random.randint(100, 9999)}, Comuna Test',
                    'per_tipo_fono': random.choice([1, 2]),
                    'per_fono': f'+56{random.randint(911111111, 999999999)}',
                    'per_apodo': nombre,
                    'per_vigente': True,
                }
            )
            
            if created:
                personas_creadas.append(persona)
                
                # Assign to group
                PersonaGrupo.objects.get_or_create(
                    per_id=persona,
                    gru_id=random.choice(grupos),
                    defaults={'peg_vigente': True}
                )

        self.personas = personas_creadas

    def populate_cursos(self):
        tipos_curso = list(TipoCurso.objects.all())
        personas = list(Persona.objects.all()[:5])  # Use first 5 persons as responsibles
        cargos = list(Cargo.objects.all())
        comunas = list(Comuna.objects.all())
        usuarios = list(Usuario.objects.all())
        
        if not all([tipos_curso, personas, cargos, comunas, usuarios]):
            self.stdout.write(self.style.WARNING('Missing required data for courses'))
            return

        cursos_data = [
            ('FI-2024-01', 'Formación Inicial 2024-1', 1, 85000, 65000, 1, 1),
            ('FI-2024-02', 'Formación Inicial 2024-2', 1, 85000, 65000, 1, 1),
            ('FM-2024-01', 'Formación Intermedia 2024-1', 2, 95000, 75000, 1, 2),
            ('FA-2024-01', 'Formación Avanzada 2024-1', 3, 105000, 85000, 1, 3),
            ('ESP-2024-01', 'Especialización en Liderazgo', 4, 120000, 95000, 2, 4),
        ]

        cursos_creados = []
        for codigo, desc, admin, cuota_con, cuota_sin, modalidad, estado in cursos_data:
            curso, created = Curso.objects.get_or_create(
                cur_codigo=codigo,
                defaults={
                    'usu_id': random.choice(usuarios),
                    'tcu_id': random.choice(tipos_curso),
                    'per_id_responsable': random.choice(personas),
                    'car_id_responsable': random.choice(cargos),
                    'com_id_lugar': random.choice(comunas),
                    'cur_fecha_solicitud': datetime.now() - timedelta(days=random.randint(30, 90)),
                    'cur_descripcion': desc,
                    'cur_administra': admin,
                    'cur_cuota_con_almuerzo': Decimal(str(cuota_con)),
                    'cur_cuota_sin_almuerzo': Decimal(str(cuota_sin)),
                    'cur_modalidad': modalidad,
                    'cur_tipo_curso': admin,
                    'cur_lugar': f'Centro Scout {random.choice(["Norte", "Centro", "Sur"])}',
                    'cur_estado': estado,
                }
            )
            
            if created:
                cursos_creados.append(curso)
                
                # Create course section
                seccion, _ = CursoSeccion.objects.get_or_create(
                    cur_id=curso,
                    cus_seccion=1,
                    defaults={'cus_cant_participante': random.randint(15, 30)}
                )
                
                # Create course dates
                fecha_inicio = datetime.now() + timedelta(days=random.randint(15, 60))
                CursoFecha.objects.get_or_create(
                    cur_id=curso,
                    cuf_fecha_inicio=fecha_inicio,
                    defaults={
                        'cuf_fecha_termino': fecha_inicio + timedelta(days=2),
                        'cuf_tipo': modalidad,
                    }
                )
                
                # Enroll some people
                ramas = list(Rama.objects.all())
                roles = list(Rol.objects.all())
                alimentaciones = list(Alimentacion.objects.all())
                personas_disponibles = list(Persona.objects.all()[5:])  # Skip responsibles
                
                for persona in random.sample(personas_disponibles, min(10, len(personas_disponibles))):
                    persona_curso, pc_created = PersonaCurso.objects.get_or_create(
                        per_id=persona,
                        cus_id=seccion,
                        defaults={
                            'rol_id': random.choice(roles),
                            'ali_id': random.choice(alimentaciones),
                            'pec_registro': True,
                            'pec_acreditado': random.choice([True, False]),
                        }
                    )
                    
                    if pc_created:
                        # Create enrollment state
                        PersonaEstadoCurso.objects.create(
                            usu_id=random.choice(usuarios),
                            pec_id=persona_curso,
                            peu_fecha_hora=datetime.now() - timedelta(days=random.randint(1, 30)),
                            peu_estado=random.choice([1, 2, 4, 5]),
                            peu_vigente=True,
                        )

        self.cursos = cursos_creados

    def populate_pagos(self):
        personas_curso = list(PersonaCurso.objects.all())
        usuarios = list(Usuario.objects.all())
        conceptos = list(ConceptoContable.objects.all())
        
        if not all([personas_curso, usuarios, conceptos]):
            self.stdout.write(self.style.WARNING('Missing required data for payments'))
            return

        # Create payments for enrolled people
        for persona_curso in random.sample(personas_curso, min(20, len(personas_curso))):
            # Create payment record
            monto = Decimal(str(random.randint(50000, 120000)))
            pago, created = PagoPersona.objects.get_or_create(
                per_id=persona_curso.per_id,
                cur_id=persona_curso.cus_id.cur_id,
                defaults={
                    'usu_id': random.choice(usuarios),
                    'pap_fecha_hora': datetime.now() - timedelta(days=random.randint(1, 45)),
                    'pap_tipo': 1,  # 1: Ingreso
                    'pap_valor': monto,
                    'pap_observacion': 'Pago de inscripción',
                }
            )
            
            if created:
                # Create payment receipt
                comprobante, _ = ComprobantePago.objects.get_or_create(
                    usu_id=random.choice(usuarios),
                    pec_id=persona_curso,
                    coc_id=random.choice(conceptos),
                    defaults={
                        'cpa_fecha_hora': datetime.now() - timedelta(days=random.randint(1, 30)),
                        'cpa_fecha': datetime.now().date() - timedelta(days=random.randint(1, 30)),
                        'cpa_numero': random.randint(1000, 9999),
                        'cpa_valor': monto,
                    }
                )
                
                # Link payment to receipt
                PagoComprobante.objects.get_or_create(
                    pap_id=pago,
                    cpa_id=comprobante,
                )

    def print_statistics(self):
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Statistics ==='))
        
        stats = {
            'Estados Civiles': EstadoCivil.objects.count(),
            'Cargos': Cargo.objects.count(),
            'Niveles': Nivel.objects.count(),
            'Ramas': Rama.objects.count(),
            'Roles': Rol.objects.count(),
            'Tipos de Archivo': TipoArchivo.objects.count(),
            'Tipos de Curso': TipoCurso.objects.count(),
            'Alimentaciones': Alimentacion.objects.count(),
            'Conceptos Contables': ConceptoContable.objects.count(),
            'Regiones': Region.objects.count(),
            'Provincias': Provincia.objects.count(),
            'Comunas': Comuna.objects.count(),
            'Zonas': Zona.objects.count(),
            'Distritos': Distrito.objects.count(),
            'Grupos': Grupo.objects.count(),
            'Proveedores': Proveedor.objects.count(),
            'Personas': Persona.objects.count(),
            'Cursos': Curso.objects.count(),
            'Inscripciones': PersonaCurso.objects.count(),
            'Pagos': PagoPersona.objects.count(),
            'Comprobantes': ComprobantePago.objects.count(),
        }
        
        for label, count in stats.items():
            self.stdout.write(f'  {label}: {count}')
        
        self.stdout.write(self.style.SUCCESS('\nDatabase ready for use!'))
