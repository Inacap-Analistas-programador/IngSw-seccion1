#!/usr/bin/env python
"""
Script para inicializar la base de datos con datos completos
GIC - Plataforma de Gestión Integral de Cursos

Este script es el ÚNICO script de inicialización de datos y pobla todas las tablas 
en el orden correcto con datos realistas y bien formateados.

Incluye:
- Geografía (regiones, provincias, comunas)
- Zonas Scouts (zonas, distritos, grupos)
- Maestros (estado civil, cargos, niveles, ramas, roles, etc.)
- Usuarios con diferentes perfiles
- Personas vinculadas a usuarios
- Proveedores
- Cursos completos
- Inscripciones de participantes
- Pagos y detalles de pago

Uso:
    python scripts/seed_database.py
    o
    python manage.py shell < scripts/seed_database.py
"""
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal
from django.utils import timezone

# Configurar Django
if __name__ == '__main__':
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
    django.setup()

from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from maestros.models import (
    EstadoCivil, Cargo, Nivel, Rama, Rol, 
    TipoArchivo, TipoCurso, Alimentacion, ConceptoContable, Perfil
)
from usuarios.models import Usuario
from personas.models import Persona, PersonaCurso
from cursos.models import Curso, CursoSeccion
from proveedores.models import Proveedor
from pagos.models import PagoPersona, ComprobantePago


def seed_geografia():
    """Seed datos de geografía de Chile"""
    print("🌍 Seeding geografía...")
    
    # Regiones de Chile
    regiones_data = [
        "Arica y Parinacota",
        "Tarapacá",
        "Antofagasta",
        "Atacama",
        "Coquimbo",
        "Valparaíso",
        "Metropolitana de Santiago",
        "O'Higgins",
        "Maule",
        "Ñuble",
        "Biobío",
        "Araucanía",
        "Los Ríos",
        "Los Lagos",
        "Aysén",
        "Magallanes y de la Antártica Chilena"
    ]
    
    regiones = []
    for nombre in regiones_data:
        region, created = Region.objects.get_or_create(
            reg_descripcion=nombre,
            defaults={'reg_vigente': True}
        )
        regiones.append(region)
        if created:
            print(f"  ✓ Región: {nombre}")
    
    # Provincias de la Región Metropolitana
    region_metropolitana = Region.objects.get(reg_descripcion="Metropolitana de Santiago")
    
    provincias_rm = [
        "Santiago", "Cordillera", "Chacabuco", 
        "Maipo", "Melipilla", "Talagante"
    ]
    
    for nombre in provincias_rm:
        provincia, created = Provincia.objects.get_or_create(
            reg_id=region_metropolitana,
            pro_descripcion=nombre,
            defaults={'pro_vigente': True}
        )
        if created:
            print(f"  ✓ Provincia: {nombre}")
    
    # Comunas de Santiago
    provincia_santiago = Provincia.objects.get(
        reg_id=region_metropolitana,
        pro_descripcion="Santiago"
    )
    
    comunas_santiago = [
        "Santiago", "Providencia", "Las Condes", "Vitacura",
        "Lo Barnechea", "Ñuñoa", "La Reina", "Macul",
        "Peñalolén", "La Florida", "San Joaquín", "La Granja",
        "San Miguel", "Independencia", "Recoleta", "Conchalí",
        "Huechuraba", "Quinta Normal", "Renca", "Cerro Navia",
        "Lo Prado", "Pudahuel", "Quilicura", "Maipú",
        "Estación Central", "Cerrillos", "Pedro Aguirre Cerda",
        "Lo Espejo", "El Bosque", "La Cisterna", "San Ramón",
        "La Pintana", "Puente Alto", "San Bernardo"
    ]
    
    for nombre in comunas_santiago:
        comuna, created = Comuna.objects.get_or_create(
            pro_id=provincia_santiago,
            com_descripcion=nombre,
            defaults={'com_vigente': True}
        )
        if created:
            print(f"  ✓ Comuna: {nombre}")
    
    print("✓ Geografía completada\n")


def seed_zonas_scouts():
    """Seed zonas y distritos scouts"""
    print("🏕️ Seeding organización scout...")
    
    zonas_data = [
        {"nombre": "Zona Metropolitana", "unilateral": False},
        {"nombre": "Zona Norte Grande", "unilateral": False},
        {"nombre": "Zona Norte Chico", "unilateral": False},
        {"nombre": "Zona Centro", "unilateral": False},
        {"nombre": "Zona Sur", "unilateral": False},
        {"nombre": "Zona Austral", "unilateral": False},
    ]
    
    for data in zonas_data:
        zona, created = Zona.objects.get_or_create(
            zon_descripcion=data["nombre"],
            defaults={
                'zon_unilateral': data["unilateral"],
                'zon_vigente': True
            }
        )
        if created:
            print(f"  ✓ Zona: {data['nombre']}")
    
    # Crear distritos
    zona_metropolitana = Zona.objects.get(zon_descripcion="Zona Metropolitana")
    distritos_rm = [
        "Distrito Santiago Centro",
        "Distrito Santiago Oriente",
        "Distrito Santiago Sur",
        "Distrito Santiago Norte",
        "Distrito Santiago Poniente",
        "Distrito Cordillera"
    ]
    
    for nombre in distritos_rm:
        distrito, created = Distrito.objects.get_or_create(
            zon_id=zona_metropolitana,
            dis_descripcion=nombre,
            defaults={'dis_vigente': True}
        )
        if created:
            print(f"  ✓ Distrito: {nombre}")
    
    # Crear grupos scouts
    distrito_centro = Distrito.objects.get(
        zon_id=zona_metropolitana,
        dis_descripcion="Distrito Santiago Centro"
    )
    
    grupos = [
        "Grupo Scout N°1 San Jorge",
        "Grupo Scout N°42 Baden Powell",
        "Grupo Scout N°15 Los Exploradores",
        "Grupo Scout N°8 Lord Baden Powell",
        "Grupo Scout N°23 San Francisco de Asís"
    ]
    
    for nombre in grupos:
        grupo, created = Grupo.objects.get_or_create(
            dis_id=distrito_centro,
            gru_descripcion=nombre,
            defaults={'gru_vigente': True}
        )
        if created:
            print(f"  ✓ Grupo: {nombre}")
    
    print("✓ Organización scout completada\n")


def seed_maestros():
    """Seed tablas maestras"""
    print("📋 Seeding tablas maestras...")
    
    # Perfiles de usuario
    perfiles = [
        "Administrador", "Coordinador", "Dirigente", 
        "Instructor", "Participante", "Observador"
    ]
    for nombre in perfiles:
        obj, created = Perfil.objects.get_or_create(
            pel_descripcion=nombre,
            defaults={'pel_vigente': True}
        )
        if created:
            print(f"  ✓ Perfil: {nombre}")
    
    # Estados civiles
    estados_civiles = [
        "Soltero/a", "Casado/a", "Viudo/a", 
        "Divorciado/a", "Conviviente Civil"
    ]
    for nombre in estados_civiles:
        obj, created = EstadoCivil.objects.get_or_create(
            esc_descripcion=nombre,
            defaults={'esc_vigente': True}
        )
        if created:
            print(f"  ✓ Estado Civil: {nombre}")
    
    # Cargos
    cargos = [
        "Dirigente", "Formador", "Coordinador de Formación",
        "Jefe de Grupo", "Comisionado", "Asesor Técnico",
        "Director de Curso", "Instructor", "Participante"
    ]
    for nombre in cargos:
        obj, created = Cargo.objects.get_or_create(
            car_descripcion=nombre,
            defaults={'car_vigente': True}
        )
        if created:
            print(f"  ✓ Cargo: {nombre}")
    
    # Ramas scouts
    ramas = [
        "Castores", "Lobatos", "Scouts", "Pioneros", "Rovers", "Adultos"
    ]
    for nombre in ramas:
        obj, created = Rama.objects.get_or_create(
            ram_descripcion=nombre,
            defaults={'ram_vigente': True}
        )
        if created:
            print(f"  ✓ Rama: {nombre}")
    
    # Niveles
    niveles_data = [
        {"nombre": "Nivel Básico", "orden": 1},
        {"nombre": "Nivel Intermedio", "orden": 2},
        {"nombre": "Nivel Avanzado", "orden": 3},
        {"nombre": "Nivel Formador", "orden": 4}
    ]
    for data in niveles_data:
        obj, created = Nivel.objects.get_or_create(
            niv_descripcion=data["nombre"],
            defaults={
                'niv_orden': data["orden"],
                'niv_vigente': True
            }
        )
        if created:
            print(f"  ✓ Nivel: {data['nombre']}")
    
    # Roles
    roles_data = [
        {"nombre": "Participante", "tipo": 1},
        {"nombre": "Instructor", "tipo": 2},
        {"nombre": "Coordinador", "tipo": 3}, 
        {"nombre": "Observador", "tipo": 4},
        {"nombre": "Staff de Apoyo", "tipo": 5}
    ]
    for data in roles_data:
        obj, created = Rol.objects.get_or_create(
            rol_descripcion=data["nombre"],
            defaults={
                'rol_tipo': data["tipo"],
                'rol_vigente': True
            }
        )
        if created:
            print(f"  ✓ Rol: {data['nombre']}")
    
    # Tipos de archivo
    tipos_archivo = [
        "Certificado de Curso", "Fotografía de Perfil", "Documento de Identidad",
        "Planilla de Inscripción", "Informe de Evaluación", "Comprobante de Pago"
    ]
    for nombre in tipos_archivo:
        obj, created = TipoArchivo.objects.get_or_create(
            tar_descripcion=nombre,
            defaults={'tar_vigente': True}
        )
        if created:
            print(f"  ✓ Tipo Archivo: {nombre}")
    
    # Tipos de curso
    tipos_curso_data = [
        {"nombre": "Curso de Formación Básica", "tipo": 1, "cant": 30},
        {"nombre": "Curso de Formación Intermedia", "tipo": 2, "cant": 25},
        {"nombre": "Curso de Formación Avanzada", "tipo": 3, "cant": 20},
        {"nombre": "Taller Especializado", "tipo": 4, "cant": 15},
        {"nombre": "Capacitación Técnica", "tipo": 5, "cant": 20},
        {"nombre": "Seminario de Actualización", "tipo": 6, "cant": 40},
        {"nombre": "Campamento Escuela", "tipo": 7, "cant": 35},
    ]
    for data in tipos_curso_data:
        obj, created = TipoCurso.objects.get_or_create(
            tcu_descripcion=data["nombre"],
            defaults={
                'tcu_tipo': data["tipo"],
                'tcu_cant_participante': data["cant"],
                'tcu_vigente': True
            }
        )
        if created:
            print(f"  ✓ Tipo Curso: {data['nombre']}")
    
    # Tipos de alimentación
    alimentaciones_data = [
        {"tipo": 1, "descripcion": "Desayuno Completo"},
        {"tipo": 2, "descripcion": "Almuerzo"},
        {"tipo": 3, "descripcion": "Once / Merienda"},
        {"tipo": 4, "descripcion": "Cena"},
        {"tipo": 5, "descripcion": "Colación Ligera"},
    ]
    for data in alimentaciones_data:
        obj, created = Alimentacion.objects.get_or_create(
            ali_tipo=data["tipo"],
            defaults={
                'ali_descripcion': data["descripcion"],
                'ali_vigente': True
            }
        )
        if created:
            print(f"  ✓ Alimentación: {data['descripcion']}")
    
    # Conceptos contables
    conceptos = [
        "Inscripción al Curso", "Matrícula Anual", "Cuota Mensual",
        "Material Didáctico", "Transporte", "Alimentación y Hospedaje",
        "Certificación y Diplomas", "Seguro de Accidentes", "Otros Gastos"
    ]
    for nombre in conceptos:
        obj, created = ConceptoContable.objects.get_or_create(
            coc_descripcion=nombre,
            defaults={'coc_vigente': True}
        )
        if created:
            print(f"  ✓ Concepto: {nombre}")
    
    print("✓ Tablas maestras completadas\n")


def seed_usuarios():
    """Seed usuarios de prueba"""
    print("👥 Seeding usuarios...")
    
    # Obtener perfiles
    perfil_admin = Perfil.objects.get(pel_descripcion="Administrador")
    perfil_coordinador = Perfil.objects.get(pel_descripcion="Coordinador")
    perfil_dirigente = Perfil.objects.get(pel_descripcion="Dirigente")
    perfil_instructor = Perfil.objects.get(pel_descripcion="Instructor")
    perfil_participante = Perfil.objects.get(pel_descripcion="Participante")
    
    # Usuario administrador
    if not Usuario.objects.filter(usu_username='admin').exists():
        admin = Usuario.objects.create(
            usu_username='admin',
            usu_email='admin@scouts.cl',
            pel_id=perfil_admin,
            usu_vigente=True
        )
        admin.set_password('admin123')
        admin.save()
        print(f"  ✓ Usuario Admin: admin / admin123")
    
    # Usuario coordinador
    if not Usuario.objects.filter(usu_username='coordinador').exists():
        coordinador = Usuario.objects.create(
            usu_username='coordinador',
            usu_email='coordinador@scouts.cl',
            pel_id=perfil_coordinador,
            usu_vigente=True
        )
        coordinador.set_password('coord123')
        coordinador.save()
        print(f"  ✓ Usuario Coordinador: coordinador / coord123")
    
    # Usuario dirigente
    if not Usuario.objects.filter(usu_username='dirigente').exists():
        dirigente = Usuario.objects.create(
            usu_username='dirigente',
            usu_email='dirigente@scouts.cl',
            pel_id=perfil_dirigente,
            usu_vigente=True
        )
        dirigente.set_password('dirigente123')
        dirigente.save()
        print(f"  ✓ Usuario Dirigente: dirigente / dirigente123")
    
    # Usuarios instructores
    instructores_data = [
        {"username": "instructor1", "email": "instructor1@scouts.cl"},
        {"username": "instructor2", "email": "instructor2@scouts.cl"},
        {"username": "instructor3", "email": "instructor3@scouts.cl"},
    ]
    
    for data in instructores_data:
        if not Usuario.objects.filter(usu_username=data["username"]).exists():
            user = Usuario.objects.create(
                usu_username=data["username"],
                usu_email=data["email"],
                pel_id=perfil_instructor,
                usu_vigente=True
            )
            user.set_password('instructor123')
            user.save()
            print(f"  ✓ Usuario Instructor: {data['username']} / instructor123")
    
    # Usuarios participantes
    participantes_data = [
        {"username": "participante1", "email": "participante1@scouts.cl"},
        {"username": "participante2", "email": "participante2@scouts.cl"},
        {"username": "participante3", "email": "participante3@scouts.cl"},
        {"username": "participante4", "email": "participante4@scouts.cl"},
        {"username": "participante5", "email": "participante5@scouts.cl"},
    ]
    
    for data in participantes_data:
        if not Usuario.objects.filter(usu_username=data["username"]).exists():
            user = Usuario.objects.create(
                usu_username=data["username"],
                usu_email=data["email"],
                pel_id=perfil_participante,
                usu_vigente=True
            )
            user.set_password('participante123')
            user.save()
            print(f"  ✓ Usuario Participante: {data['username']} / participante123")
    
    print("✓ Usuarios completados\n")


def seed_personas():
    """Seed personas vinculadas a usuarios"""
    print("👨‍👩‍👧‍👦 Seeding personas...")
    
    estado_civil_soltero = EstadoCivil.objects.get(esc_descripcion="Soltero/a")
    estado_civil_casado = EstadoCivil.objects.get(esc_descripcion="Casado/a")
    comuna_santiago = Comuna.objects.get(com_descripcion="Santiago")
    comuna_providencia = Comuna.objects.get(com_descripcion="Providencia")
    
    # Crear personas para usuarios existentes
    personas_data = [
        {
            "username": "coordinador",
            "nombres": "María José",
            "apelpat": "González",
            "apelmat": "Silva",
            "run": 12345678,
            "dv": "9",
            "fecha_nac": timezone.make_aware(datetime(1985, 3, 15)),
            "direccion": "Avenida Libertador Bernardo O'Higgins 1234",
            "tipo_fono": 1,
            "fono": "+56912345678",
            "email": "mj.gonzalez@gmail.com",
            "apodo": "MJ",
            "estado_civil": estado_civil_casado,
            "comuna": comuna_providencia
        },
        {
            "username": "dirigente",
            "nombres": "Carlos Alberto",
            "apelpat": "Muñoz",
            "apelmat": "Torres",
            "run": 98765432,
            "dv": "1",
            "fecha_nac": timezone.make_aware(datetime(1988, 7, 20)),
            "direccion": "Calle Agustinas 567",
            "tipo_fono": 1,
            "fono": "+56987654321",
            "email": "c.munoz@gmail.com",
            "apodo": "Carlos",
            "estado_civil": estado_civil_soltero,
            "comuna": comuna_santiago
        },
        {
            "username": "instructor1",
            "nombres": "Patricia",
            "apelpat": "Rodríguez",
            "apelmat": "Fernández",
            "run": 11223344,
            "dv": "5",
            "fecha_nac": timezone.make_aware(datetime(1990, 11, 10)),
            "direccion": "Pasaje Los Almendros 890",
            "tipo_fono": 1,
            "fono": "+56911223344",
            "email": "p.rodriguez@gmail.com",
            "apodo": "Paty",
            "estado_civil": estado_civil_soltero,
            "comuna": comuna_providencia
        },
        {
            "username": "instructor2",
            "nombres": "Juan Pablo",
            "apelpat": "Soto",
            "apelmat": "Vargas",
            "run": 22334455,
            "dv": "6",
            "fecha_nac": timezone.make_aware(datetime(1987, 5, 25)),
            "direccion": "Avenida Matta 456",
            "tipo_fono": 1,
            "fono": "+56922334455",
            "email": "jp.soto@gmail.com",
            "apodo": "JP",
            "estado_civil": estado_civil_casado,
            "comuna": comuna_santiago
        },
        {
            "username": "instructor3",
            "nombres": "Andrea",
            "apelpat": "López",
            "apelmat": "Martínez",
            "run": 33445566,
            "dv": "7",
            "fecha_nac": timezone.make_aware(datetime(1992, 8, 30)),
            "direccion": "Calle Moneda 789",
            "tipo_fono": 1,
            "fono": "+56933445566",
            "email": "a.lopez@gmail.com",
            "apodo": "Andy",
            "estado_civil": estado_civil_soltero,
            "comuna": comuna_providencia
        }
    ]
    
    for data in personas_data:
        try:
            usuario = Usuario.objects.get(usu_username=data["username"])
            persona, created = Persona.objects.get_or_create(
                usu_id=usuario,
                defaults={
                    'per_nombres': data["nombres"],
                    'per_apelpat': data["apelpat"],
                    'per_apelmat': data["apelmat"],
                    'per_run': data["run"],
                    'per_dv': data["dv"],
                    'per_fecha_nac': data["fecha_nac"],
                    'per_direccion': data["direccion"],
                    'per_tipo_fono': data["tipo_fono"],
                    'per_fono': data["fono"],
                    'per_email': data["email"],
                    'per_apodo': data["apodo"],
                    'esc_id': data["estado_civil"],
                    'com_id': data["comuna"],
                    'per_vigente': True
                }
            )
            if created:
                print(f"  ✓ Persona: {data['nombres']} {data['apelpat']}")
        except Usuario.DoesNotExist:
            print(f"  ⚠ Usuario {data['username']} no encontrado, saltando persona")
    
    print("✓ Personas completadas\n")


def seed_proveedores():
    """Seed proveedores"""
    print("🏢 Seeding proveedores...")
    
    proveedores_data = [
        {
            "descripcion": "Centro de Convenciones Scouts Chile",
            "direccion": "Avenida Vicuña Mackenna 456",
            "celular1": "+56222334455",
            "celular2": "+56922334455"
        },
        {
            "descripcion": "Catering y Alimentación Scout Ltda.",
            "direccion": "Calle Matucana 789",
            "celular1": "+56223344556",
            "celular2": "+56923344556"
        },
        {
            "descripcion": "Librería y Materiales Didácticos",
            "direccion": "Avenida Providencia 1234",
            "celular1": "+56224455667",
            "celular2": "+56924455667"
        },
        {
            "descripcion": "Transporte y Logística Scouts",
            "direccion": "Calle San Diego 567",
            "celular1": "+56225566778",
            "celular2": "+56925566778"
        }
    ]
    
    for data in proveedores_data:
        proveedor, created = Proveedor.objects.get_or_create(
            prv_descripcion=data["descripcion"],
            defaults={
                'prv_direccion': data["direccion"],
                'prv_celular1': data["celular1"],
                'prv_celular2': data["celular2"],
                'prv_vigente': True
            }
        )
        if created:
            print(f"  ✓ Proveedor: {data['descripcion']}")
    
    print("✓ Proveedores completados\n")


def seed_cursos():
    """Seed cursos con datos realistas"""
    print("📚 Seeding cursos...")
    
    # Get required foreign keys
    tipo_basico = TipoCurso.objects.get(tcu_descripcion="Curso de Formación Básica")
    tipo_taller = TipoCurso.objects.get(tcu_descripcion="Taller Especializado")
    
    cargo_director = Cargo.objects.get(car_descripcion="Director de Curso")
    
    # Get a persona to be the responsible
    persona_responsable = Persona.objects.first()
    usuario_responsable = Usuario.objects.get(usu_username='coordinador')
    
    comuna_santiago = Comuna.objects.get(com_descripcion="Santiago")
    comuna_providencia = Comuna.objects.get(com_descripcion="Providencia")
    
    # Fechas para los cursos
    hoy = timezone.now()
    
    cursos_data = [
        {
            "codigo": "CFB-2024-001",
            "descripcion": "Curso Formación Básica",
            "observacion": "Curso introductorio para nuevos dirigentes scouts",
            "fecha_solicitud": hoy,
            "cuota_con_almuerzo": Decimal("45000.00"),
            "cuota_sin_almuerzo": Decimal("35000.00"),
            "modalidad": 1,  # Presencial
            "tipo_curso": 1,  # Formación
            "lugar": "Centro Scout Regional - Santiago Centro",
            "estado": 1,  # Activo
            "administra": 1,  # Nacional
            "comuna": comuna_santiago,
            "tipo": tipo_basico
        },
        {
            "codigo": "TAL-2024-002",
            "descripcion": "Taller Técnicas de Campamento",
            "observacion": "Técnicas avanzadas de campamento y construcciones scout",
            "fecha_solicitud": hoy,
            "cuota_con_almuerzo": Decimal("25000.00"),
            "cuota_sin_almuerzo": Decimal("20000.00"),
            "modalidad": 1,  # Presencial
            "tipo_curso": 4,  # Taller
            "lugar": "Campamento Scout - Melipilla",
            "estado": 1,  # Activo
            "administra": 2,  # Regional
            "comuna": comuna_providencia,
            "tipo": tipo_taller
        }
    ]
    
    for data in cursos_data:
        curso, created = Curso.objects.get_or_create(
            cur_codigo=data["codigo"],
            defaults={
                'usu_id': usuario_responsable,
                'tcu_id': data["tipo"],
                'per_id_responsable': persona_responsable,
                'car_id_responsable': cargo_director,
                'com_id_lugar': data["comuna"],
                'cur_fecha_solicitud': data["fecha_solicitud"],
                'cur_descripcion': data["descripcion"],
                'cur_observacion': data["observacion"],
                'cur_administra': data["administra"],
                'cur_cuota_con_almuerzo': data["cuota_con_almuerzo"],
                'cur_cuota_sin_almuerzo': data["cuota_sin_almuerzo"],
                'cur_modalidad': data["modalidad"],
                'cur_tipo_curso': data["tipo_curso"],
                'cur_lugar': data["lugar"],
                'cur_estado': data["estado"]
            }
        )
        if created:
            print(f"  ✓ Curso: {data['descripcion']}")
            
            # Create a section for each course
            seccion, sec_created = CursoSeccion.objects.get_or_create(
                cur_id=curso,
                cus_seccion=1,
                defaults={
                    'cus_cant_participante': 30
                }
            )
            if sec_created:
                print(f"    ✓ Sección 1 creada para {data['descripcion']}")
    
    print("✓ Cursos completados\n")


def seed_inscripciones():
    """Seed inscripciones a cursos"""
    print("✍️ Seeding inscripciones...")
    
    rol_participante = Rol.objects.get(rol_descripcion="Participante")
    alimentacion = Alimentacion.objects.first()
    
    # Get personas (only those that have been created)
    personas = list(Persona.objects.all())
    
    if not personas:
        print("  ⚠ No hay personas creadas, saltando inscripciones")
        return
    
    # Get curso sections
    secciones = CursoSeccion.objects.all()
    
    if not secciones:
        print("  ⚠ No hay secciones de curso creadas, saltando inscripciones")
        return
    
    # Create at least 2 inscriptions
    inscripciones_data = [
        {
            "persona": personas[0],
            "seccion": secciones[0],
            "rol": rol_participante,
            "alimentacion": alimentacion,
            "registro": True,
            "acreditado": False,
            "observacion": "Inscripción regular"
        },
        {
            "persona": personas[1] if len(personas) > 1 else personas[0],
            "seccion": secciones[0],
            "rol": rol_participante,
            "alimentacion": alimentacion,
            "registro": True,
            "acreditado": False,
            "observacion": "Inscripción regular"
        }
    ]
    
    for data in inscripciones_data:
        inscripcion, created = PersonaCurso.objects.get_or_create(
            per_id=data["persona"],
            cus_id=data["seccion"],
            defaults={
                'rol_id': data["rol"],
                'ali_id': data["alimentacion"],
                'pec_registro': data["registro"],
                'pec_acreditado': data["acreditado"],
                'pec_observacion': data["observacion"]
            }
        )
        if created:
            print(f"  ✓ {data['persona'].per_nombres} {data['persona'].per_apelpat} inscrito en {data['seccion'].cur_id.cur_descripcion}")
    
    print("✓ Inscripciones completadas\n")


def seed_pagos():
    """Seed pagos para inscripciones"""
    print("💳 Seeding pagos...")
    
    # Get inscriptions
    inscripciones = PersonaCurso.objects.all()
    
    if not inscripciones:
        print("  ⚠ No hay inscripciones creadas, saltando pagos")
        return
    
    # Get a user to register the payment
    usuario_coordinador = Usuario.objects.get(usu_username='coordinador')
    
    # Create at least 2 payments
    for i, inscripcion in enumerate(inscripciones[:2]):
        pago, created = PagoPersona.objects.get_or_create(
            per_id=inscripcion.per_id,
            cur_id=inscripcion.cus_id.cur_id,
            defaults={
                'usu_id': usuario_coordinador,
                'pap_fecha_hora': timezone.now(),
                'pap_tipo': 1,  # Ingreso
                'pap_valor': inscripcion.cus_id.cur_id.cur_cuota_con_almuerzo,
                'pap_observacion': f'Pago de inscripción a {inscripcion.cus_id.cur_id.cur_descripcion}'
            }
        )
        if created:
            print(f"  ✓ Pago registrado para {inscripcion.per_id.per_nombres} {inscripcion.per_id.per_apelpat} - ${pago.pap_valor}")
    
    print("✓ Pagos completados\n")


def main():
    """Función principal de seeding"""
    print("\n" + "="*70)
    print("🏕️  SEED DATABASE - GIC Sistema Scout")
    print("="*70 + "\n")
    
    try:
        seed_geografia()
        seed_zonas_scouts()
        seed_maestros()
        seed_usuarios()
        seed_personas()
        seed_proveedores()
        seed_cursos()
        seed_inscripciones()
        seed_pagos()
        
        print("="*70)
        print("✅ Database seeding completado exitosamente!")
        print("="*70 + "\n")
        
        print("📝 Credenciales de acceso:")
        print("  Admin:         admin / admin123")
        print("  Coordinador:   coordinador / coord123")
        print("  Dirigente:     dirigente / dirigente123")
        print("  Instructores:  instructor1-3 / instructor123")
        print("  Participantes: participante1-5 / participante123")
        print()
        
        # Estadísticas
        print("📊 Estadísticas de datos creados:")
        print(f"  Regiones: {Region.objects.count()}")
        print(f"  Provincias: {Provincia.objects.count()}")
        print(f"  Comunas: {Comuna.objects.count()}")
        print(f"  Zonas: {Zona.objects.count()}")
        print(f"  Distritos: {Distrito.objects.count()}")
        print(f"  Grupos: {Grupo.objects.count()}")
        print(f"  Usuarios: {Usuario.objects.count()}")
        print(f"  Personas: {Persona.objects.count()}")
        print(f"  Proveedores: {Proveedor.objects.count()}")
        print(f"  Cursos: {Curso.objects.count()}")
        print(f"  Inscripciones: {PersonaCurso.objects.count()}")
        print(f"  Pagos: {PagoPersona.objects.count()}")
        print()
        
    except Exception as e:
        print(f"\n❌ Error durante el seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
