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

# Configurar Django
if __name__ == '__main__':
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
    django.setup()

from django.contrib.auth import get_user_model
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from maestros.models import (
    EstadoCivil, Cargo, Nivel, Rama, Rol, 
    TipoArchivo, TipoCurso, Alimentacion, ConceptoContable
)
from personas.models import Persona
from cursos.models import Curso, CursoUsuario
from proveedores.models import Proveedor
from pagos.models import PagoPersona, ComprobantePago

User = get_user_model()


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
    
    # Usuario administrador
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@scouts.cl',
            password='admin123',
            usu_nombre='Administrador',
            usu_apellido_paterno='Sistema',
            usu_apellido_materno='GIC',
            is_staff=True,
            is_superuser=True
        )
        print(f"  ✓ Usuario Admin: admin / admin123")
    
    # Usuario coordinador
    if not User.objects.filter(username='coordinador').exists():
        coordinador = User.objects.create_user(
            username='coordinador',
            email='coordinador@scouts.cl',
            password='coord123',
            usu_nombre='María José',
            usu_apellido_paterno='González',
            usu_apellido_materno='Silva',
            is_staff=True
        )
        print(f"  ✓ Usuario Coordinador: coordinador / coord123")
    
    # Usuario dirigente
    if not User.objects.filter(username='dirigente').exists():
        dirigente = User.objects.create_user(
            username='dirigente',
            email='dirigente@scouts.cl',
            password='dirigente123',
            usu_nombre='Carlos Alberto',
            usu_apellido_paterno='Muñoz',
            usu_apellido_materno='Torres'
        )
        print(f"  ✓ Usuario Dirigente: dirigente / dirigente123")
    
    # Usuarios instructores
    instructores_data = [
        {"username": "instructor1", "nombre": "Patricia", "paterno": "Rodríguez", "materno": "Fernández"},
        {"username": "instructor2", "nombre": "Juan Pablo", "paterno": "Soto", "materno": "Vargas"},
        {"username": "instructor3", "nombre": "Andrea", "paterno": "López", "materno": "Martínez"},
    ]
    
    for data in instructores_data:
        if not User.objects.filter(username=data["username"]).exists():
            user = User.objects.create_user(
                username=data["username"],
                email=f"{data['username']}@scouts.cl",
                password='instructor123',
                usu_nombre=data["nombre"],
                usu_apellido_paterno=data["paterno"],
                usu_apellido_materno=data["materno"]
            )
            print(f"  ✓ Usuario Instructor: {data['username']} / instructor123")
    
    # Usuarios participantes
    participantes_data = [
        {"username": "participante1", "nombre": "Roberto", "paterno": "Fuentes", "materno": "Pérez"},
        {"username": "participante2", "nombre": "Claudia", "paterno": "Ramírez", "materno": "Jiménez"},
        {"username": "participante3", "nombre": "Diego", "paterno": "Castro", "materno": "Morales"},
        {"username": "participante4", "nombre": "Valentina", "paterno": "Hernández", "materno": "Rojas"},
        {"username": "participante5", "nombre": "Felipe", "paterno": "Silva", "materno": "Contreras"},
    ]
    
    for data in participantes_data:
        if not User.objects.filter(username=data["username"]).exists():
            user = User.objects.create_user(
                username=data["username"],
                email=f"{data['username']}@scouts.cl",
                password='participante123',
                usu_nombre=data["nombre"],
                usu_apellido_paterno=data["paterno"],
                usu_apellido_materno=data["materno"]
            )
            print(f"  ✓ Usuario Participante: {data['username']} / participante123")
    
    print("✓ Usuarios completados\n")


def seed_personas():
    """Seed personas vinculadas a usuarios"""
    print("👨‍👩‍👧‍👦 Seeding personas...")
    
    estado_civil_soltero = EstadoCivil.objects.get(esc_descripcion="Soltero/a")
    estado_civil_casado = EstadoCivil.objects.get(esc_descripcion="Casado/a")
    comuna_santiago = Comuna.objects.get(com_descripcion="Santiago")
    comuna_providencia = Comuna.objects.get(com_descripcion="Providencia")
    grupo = Grupo.objects.first()
    
    # Crear personas para usuarios existentes
    users_data = [
        {
            "user": User.objects.get(username='coordinador'),
            "rut": "12345678-9",
            "sexo": "F",
            "fecha_nacimiento": "1985-03-15",
            "direccion": "Avenida Libertador Bernardo O'Higgins 1234",
            "telefono": "+56912345678",
            "email_personal": "mj.gonzalez@gmail.com",
            "estado_civil": estado_civil_casado,
            "comuna": comuna_providencia
        },
        {
            "user": User.objects.get(username='dirigente'),
            "rut": "98765432-1",
            "sexo": "M",
            "fecha_nacimiento": "1988-07-20",
            "direccion": "Calle Agustinas 567",
            "telefono": "+56987654321",
            "email_personal": "c.munoz@gmail.com",
            "estado_civil": estado_civil_soltero,
            "comuna": comuna_santiago
        },
        {
            "user": User.objects.get(username='instructor1'),
            "rut": "11223344-5",
            "sexo": "F",
            "fecha_nacimiento": "1990-11-10",
            "direccion": "Pasaje Los Almendros 890",
            "telefono": "+56911223344",
            "email_personal": "p.rodriguez@gmail.com",
            "estado_civil": estado_civil_soltero,
            "comuna": comuna_providencia
        }
    ]
    
    for data in users_data:
        persona, created = Persona.objects.get_or_create(
            usu_id=data["user"],
            defaults={
                'per_rut': data["rut"],
                'per_sexo': data["sexo"],
                'per_fecha_nacimiento': data["fecha_nacimiento"],
                'per_direccion': data["direccion"],
                'per_telefono': data["telefono"],
                'per_email': data["email_personal"],
                'esc_id': data["estado_civil"],
                'com_id': data["comuna"],
                'gru_id': grupo,
                'per_vigente': True
            }
        )
        if created:
            print(f"  ✓ Persona: {data['user'].usu_nombre} {data['user'].usu_apellido_paterno}")
    
    print("✓ Personas completadas\n")


def seed_proveedores():
    """Seed proveedores"""
    print("🏢 Seeding proveedores...")
    
    proveedores_data = [
        {
            "razon_social": "Centro de Convenciones Scouts Chile",
            "rut": "76543210-9",
            "direccion": "Avenida Vicuña Mackenna 456",
            "telefono": "+56222334455",
            "email": "contacto@centroconvencionesscouts.cl"
        },
        {
            "razon_social": "Catering y Alimentación Scout Ltda.",
            "rut": "78901234-5",
            "direccion": "Calle Matucana 789",
            "telefono": "+56223344556",
            "email": "ventas@cateringscout.cl"
        },
        {
            "razon_social": "Librería y Materiales Didácticos",
            "rut": "77665544-3",
            "direccion": "Avenida Providencia 1234",
            "telefono": "+56224455667",
            "email": "pedidos@libreriascout.cl"
        },
        {
            "razon_social": "Transporte y Logística Scouts",
            "rut": "79988776-6",
            "direccion": "Calle San Diego 567",
            "telefono": "+56225566778",
            "email": "reservas@transportescout.cl"
        }
    ]
    
    for data in proveedores_data:
        proveedor, created = Proveedor.objects.get_or_create(
            pro_razon_social=data["razon_social"],
            defaults={
                'pro_rut': data["rut"],
                'pro_direccion': data["direccion"],
                'pro_telefono': data["telefono"],
                'pro_email': data["email"],
                'pro_vigente': True
            }
        )
        if created:
            print(f"  ✓ Proveedor: {data['razon_social']}")
    
    print("✓ Proveedores completados\n")


def seed_cursos():
    """Seed cursos con datos realistas"""
    print("📚 Seeding cursos...")
    
    tipo_basico = TipoCurso.objects.get(tcu_descripcion="Curso de Formación Básica")
    tipo_intermedio = TipoCurso.objects.get(tcu_descripcion="Curso de Formación Intermedia")
    tipo_avanzado = TipoCurso.objects.get(tcu_descripcion="Curso de Formación Avanzada")
    tipo_taller = TipoCurso.objects.get(tcu_descripcion="Taller Especializado")
    
    nivel_basico = Nivel.objects.get(niv_descripcion="Nivel Básico")
    nivel_intermedio = Nivel.objects.get(niv_descripcion="Nivel Intermedio")
    nivel_avanzado = Nivel.objects.get(niv_descripcion="Nivel Avanzado")
    
    rama_scouts = Rama.objects.get(ram_descripcion="Scouts")
    rama_pioneros = Rama.objects.get(ram_descripcion="Pioneros")
    rama_adultos = Rama.objects.get(ram_descripcion="Adultos")
    
    grupo = Grupo.objects.first()
    
    # Fechas para los cursos
    hoy = datetime.now().date()
    
    cursos_data = [
        {
            "codigo": "CFB-2024-001",
            "nombre": "Curso de Formación Básica - Marzo 2024",
            "descripcion": "Curso introductorio para nuevos dirigentes scouts. Incluye fundamentos del método scout, pedagogía scout y primeros auxilios básicos.",
            "fecha_inicio": hoy + timedelta(days=30),
            "fecha_termino": hoy + timedelta(days=32),
            "fecha_inicio_inscripcion": hoy,
            "fecha_termino_inscripcion": hoy + timedelta(days=25),
            "cupo": 30,
            "precio": Decimal("45000.00"),
            "tipo": tipo_basico,
            "nivel": nivel_basico,
            "rama": rama_adultos,
            "lugar": "Centro Scout Regional - Santiago Centro"
        },
        {
            "codigo": "CFI-2024-002",
            "nombre": "Curso de Formación Intermedia - Abril 2024",
            "descripcion": "Profundización en técnicas scout, liderazgo de equipo, planificación de actividades y gestión de proyectos educativos.",
            "fecha_inicio": hoy + timedelta(days=45),
            "fecha_termino": hoy + timedelta(days=48),
            "fecha_inicio_inscripcion": hoy,
            "fecha_termino_inscripcion": hoy + timedelta(days=40),
            "cupo": 25,
            "precio": Decimal("65000.00"),
            "tipo": tipo_intermedio,
            "nivel": nivel_intermedio,
            "rama": rama_adultos,
            "lugar": "Campamento La Esperanza - Cajón del Maipo"
        },
        {
            "codigo": "CFA-2024-003",
            "nombre": "Curso de Formación Avanzada - Mayo 2024",
            "descripcion": "Curso para formadores de formadores. Metodología de enseñanza, evaluación de competencias y desarrollo curricular en el movimiento scout.",
            "fecha_inicio": hoy + timedelta(days=60),
            "fecha_termino": hoy + timedelta(days=64),
            "fecha_inicio_inscripcion": hoy + timedelta(days=5),
            "fecha_termino_inscripcion": hoy + timedelta(days=55),
            "cupo": 20,
            "precio": Decimal("85000.00"),
            "tipo": tipo_avanzado,
            "nivel": nivel_avanzado,
            "rama": rama_adultos,
            "lugar": "Centro de Formación Nacional - Pirque"
        },
        {
            "codigo": "TAL-2024-004",
            "nombre": "Taller de Técnicas de Campamento",
            "descripcion": "Técnicas avanzadas de campamento: construcciones scout, cocina al aire libre, orientación y supervivencia en la naturaleza.",
            "fecha_inicio": hoy + timedelta(days=20),
            "fecha_termino": hoy + timedelta(days=21),
            "fecha_inicio_inscripcion": hoy,
            "fecha_termino_inscripcion": hoy + timedelta(days=15),
            "cupo": 15,
            "precio": Decimal("25000.00"),
            "tipo": tipo_taller,
            "nivel": nivel_intermedio,
            "rama": rama_pioneros,
            "lugar": "Campamento Scout - Melipilla"
        },
        {
            "codigo": "TAL-2024-005",
            "nombre": "Taller de Primeros Auxilios Avanzados",
            "descripcion": "Certificación en primeros auxilios avanzados para actividades scout. RCP, manejo de trauma y emergencias en terreno.",
            "fecha_inicio": hoy + timedelta(days=15),
            "fecha_termino": hoy + timedelta(days=16),
            "fecha_inicio_inscripcion": hoy,
            "fecha_termino_inscripcion": hoy + timedelta(days=10),
            "cupo": 20,
            "precio": Decimal("35000.00"),
            "tipo": tipo_taller,
            "nivel": nivel_basico,
            "rama": rama_adultos,
            "lugar": "Cruz Roja Chilena - Santiago"
        },
        {
            "codigo": "CFB-2024-006",
            "nombre": "Curso Básico para Dirigentes de Scouts",
            "descripcion": "Formación específica para dirigentes de la rama scouts (11-14 años). Psicología del desarrollo, juegos y dinámicas para esta edad.",
            "fecha_inicio": hoy + timedelta(days=35),
            "fecha_termino": hoy + timedelta(days=37),
            "fecha_inicio_inscripcion": hoy,
            "fecha_termino_inscripcion": hoy + timedelta(days=30),
            "cupo": 30,
            "precio": Decimal("42000.00"),
            "tipo": tipo_basico,
            "nivel": nivel_basico,
            "rama": rama_scouts,
            "lugar": "Sede Nacional - Providencia"
        }
    ]
    
    for data in cursos_data:
        curso, created = Curso.objects.get_or_create(
            cur_codigo=data["codigo"],
            defaults={
                'cur_nombre': data["nombre"],
                'cur_descripcion': data["descripcion"],
                'cur_fecha_inicio': data["fecha_inicio"],
                'cur_fecha_termino': data["fecha_termino"],
                'cur_fecha_inicio_inscripcion': data["fecha_inicio_inscripcion"],
                'cur_fecha_termino_inscripcion': data["fecha_termino_inscripcion"],
                'cur_cupo': data["cupo"],
                'cur_precio': data["precio"],
                'tcu_id': data["tipo"],
                'niv_id': data["nivel"],
                'ram_id': data["rama"],
                'gru_id': grupo,
                'cur_lugar': data["lugar"],
                'cur_vigente': True
            }
        )
        if created:
            print(f"  ✓ Curso: {data['nombre']}")
    
    print("✓ Cursos completados\n")


def seed_inscripciones():
    """Seed inscripciones a cursos"""
    print("✍️ Seeding inscripciones...")
    
    rol_participante = Rol.objects.get(rol_descripcion="Participante")
    rol_instructor = Rol.objects.get(rol_descripcion="Instructor")
    
    # Asignar instructores a cursos
    cursos = Curso.objects.all()
    instructores = [
        User.objects.get(username='instructor1'),
        User.objects.get(username='instructor2'),
        User.objects.get(username='instructor3'),
    ]
    
    for i, curso in enumerate(cursos):
        instructor = instructores[i % len(instructores)]
        inscripcion, created = CursoUsuario.objects.get_or_create(
            cur_id=curso,
            usu_id=instructor,
            defaults={
                'rol_id': rol_instructor,
                'cuu_fecha_inscripcion': datetime.now(),
                'cuu_vigente': True
            }
        )
        if created:
            print(f"  ✓ Instructor asignado a {curso.cur_nombre}")
    
    # Inscribir participantes en algunos cursos
    participantes = [
        User.objects.get(username='participante1'),
        User.objects.get(username='participante2'),
        User.objects.get(username='participante3'),
        User.objects.get(username='participante4'),
        User.objects.get(username='participante5'),
    ]
    
    # Inscribir todos los participantes en el primer curso
    primer_curso = Curso.objects.first()
    for participante in participantes:
        inscripcion, created = CursoUsuario.objects.get_or_create(
            cur_id=primer_curso,
            usu_id=participante,
            defaults={
                'rol_id': rol_participante,
                'cuu_fecha_inscripcion': datetime.now(),
                'cuu_vigente': True
            }
        )
        if created:
            print(f"  ✓ {participante.usu_nombre} inscrito en {primer_curso.cur_nombre}")
    
    # Inscribir algunos en otros cursos
    segundo_curso = Curso.objects.all()[1] if Curso.objects.count() > 1 else None
    if segundo_curso:
        for participante in participantes[:3]:
            inscripcion, created = CursoUsuario.objects.get_or_create(
                cur_id=segundo_curso,
                usu_id=participante,
                defaults={
                    'rol_id': rol_participante,
                    'cuu_fecha_inscripcion': datetime.now(),
                    'cuu_vigente': True
                }
            )
            if created:
                print(f"  ✓ {participante.usu_nombre} inscrito en {segundo_curso.cur_nombre}")
    
    print("✓ Inscripciones completadas\n")


def seed_pagos():
    """Seed pagos para inscripciones"""
    print("💳 Seeding pagos...")
    
    concepto_inscripcion = ConceptoContable.objects.get(coc_descripcion="Inscripción al Curso")
    concepto_material = ConceptoContable.objects.get(coc_descripcion="Material Didáctico")
    
    # Obtener inscripciones de participantes
    inscripciones = CursoUsuario.objects.filter(
        rol_id__rol_descripcion="Participante"
    )
    
    for inscripcion in inscripciones:
        # Crear pago principal
        pago, created = Pago.objects.get_or_create(
            cuu_id=inscripcion,
            defaults={
                'pag_fecha': datetime.now(),
                'pag_monto': inscripcion.cur_id.cur_precio,
                'pag_estado': 'pagado',
                'pag_metodo': 'transferencia',
                'pag_comprobante': f'COMP-{inscripcion.cuu_id:06d}',
                'pag_vigente': True
            }
        )
        
        if created:
            # Crear detalle de pago
            DetallePago.objects.create(
                pag_id=pago,
                coc_id=concepto_inscripcion,
                dpa_monto=inscripcion.cur_id.cur_precio,
                dpa_descripcion=f"Inscripción a {inscripcion.cur_id.cur_nombre}",
                dpa_vigente=True
            )
            print(f"  ✓ Pago registrado para {inscripcion.usu_id.usu_nombre} - ${inscripcion.cur_id.cur_precio}")
    
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
        print(f"  Usuarios: {User.objects.count()}")
        print(f"  Personas: {Persona.objects.count()}")
        print(f"  Proveedores: {Proveedor.objects.count()}")
        print(f"  Cursos: {Curso.objects.count()}")
        print(f"  Inscripciones: {CursoUsuario.objects.count()}")
        print(f"  Pagos: {Pago.objects.count()}")
        print()
        
    except Exception as e:
        print(f"\n❌ Error durante el seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
