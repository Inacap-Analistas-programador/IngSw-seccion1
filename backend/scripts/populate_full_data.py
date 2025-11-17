#!/usr/bin/env python
"""
Script to populate comprehensive data for the GIC system
"""
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Setup Django
if __name__ == '__main__':
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
    django.setup()

from usuarios.models import Usuario, PerfilAplicacion
from maestros.models import *
from geografia.models import *
from personas.models import *
from cursos.models import *
from proveedores.models import Proveedor
from pagos.models import *

def create_usuarios():
    """Create test users"""
    print("Creating usuarios...")
    
    # Get perfil
    perfil_coordinador, _ = Perfil.objects.get_or_create(
        pel_descripcion="Coordinador",
        defaults={'pel_vigente': True}
    )
    
    perfil_dirigente, _ = Perfil.objects.get_or_create(
        pel_descripcion="Dirigente",
        defaults={'pel_vigente': True}
    )
    
    perfil_participante, _ = Perfil.objects.get_or_create(
        pel_descripcion="Participante",
        defaults={'pel_vigente': True}
    )
    
    # Create users
    users_data = [
        {
            "username": "maria.gonzalez",
            "email": "maria.gonzalez@scouts.cl",
            "perfil": perfil_coordinador
        },
        {
            "username": "carlos.munoz",
            "email": "carlos.munoz@scouts.cl",
            "perfil": perfil_dirigente
        },
        {
            "username": "patricia.rodriguez",
            "email": "patricia.rodriguez@scouts.cl",
            "perfil": perfil_dirigente
        },
        {
            "username": "juan.soto",
            "email": "juan.soto@scouts.cl",
            "perfil": perfil_participante
        },
        {
            "username": "ana.lopez",
            "email": "ana.lopez@scouts.cl",
            "perfil": perfil_participante
        },
        {
            "username": "diego.castro",
            "email": "diego.castro@scouts.cl",
            "perfil": perfil_participante
        },
        {
            "username": "valentina.hernandez",
            "email": "valentina.hernandez@scouts.cl",
            "perfil": perfil_participante
        },
        {
            "username": "felipe.silva",
            "email": "felipe.silva@scouts.cl",
            "perfil": perfil_participante
        }
    ]
    
    created_users = []
    for data in users_data:
        user, created = Usuario.objects.get_or_create(
            usu_username=data["username"],
            defaults={
                'usu_email': data["email"],
                'pel_id': data["perfil"],
                'usu_vigente': True
            }
        )
        if created:
            user.set_password('scout123')
            user.save()
            print(f"  ✓ Usuario: {data['username']}")
        created_users.append(user)
    
    return created_users

def create_personas(users):
    """Create personas for users"""
    print("Creating personas...")
    
    estado_civil = EstadoCivil.objects.first()
    comuna = Comuna.objects.first()
    
    personas_data = [
        {
            "user": users[0],
            "run": 12345678,
            "dv": "9",
            "nombres": "María José",
            "apelpat": "González",
            "apelmat": "Silva",
            "email": "maria.gonzalez@gmail.com",
            "fecha_nac": "1985-03-15",
            "direccion": "Avenida Libertador Bernardo O'Higgins 1234, Santiago",
            "fono": "912345678",
            "apodo": "Majo"
        },
        {
            "user": users[1],
            "run": 98765432,
            "dv": "1",
            "nombres": "Carlos Alberto",
            "apelpat": "Muñoz",
            "apelmat": "Torres",
            "email": "carlos.munoz@gmail.com",
            "fecha_nac": "1988-07-20",
            "direccion": "Calle Agustinas 567, Santiago Centro",
            "fono": "987654321",
            "apodo": "Carlitos"
        },
        {
            "user": users[2],
            "run": 11223344,
            "dv": "5",
            "nombres": "Patricia Andrea",
            "apelpat": "Rodríguez",
            "apelmat": "Fernández",
            "email": "patricia.rodriguez@gmail.com",
            "fecha_nac": "1990-11-10",
            "direccion": "Pasaje Los Almendros 890, Providencia",
            "fono": "911223344",
            "apodo": "Paty"
        },
        {
            "user": users[3],
            "run": 22334455,
            "dv": "6",
            "nombres": "Juan Pablo",
            "apelpat": "Soto",
            "apelmat": "Vargas",
            "email": "juan.soto@gmail.com",
            "fecha_nac": "2000-05-12",
            "direccion": "Calle Los Aromos 234, Ñuñoa",
            "fono": "922334455",
            "apodo": "JP"
        },
        {
            "user": users[4],
            "run": 33445566,
            "dv": "7",
            "nombres": "Ana María",
            "apelpat": "López",
            "apelmat": "Martínez",
            "email": "ana.lopez@gmail.com",
            "fecha_nac": "1998-09-25",
            "direccion": "Avenida Grecia 567, Ñuñoa",
            "fono": "933445566",
            "apodo": "Ani"
        },
        {
            "user": users[5],
            "run": 44556677,
            "dv": "8",
            "nombres": "Diego Andrés",
            "apelpat": "Castro",
            "apelmat": "Morales",
            "email": "diego.castro@gmail.com",
            "fecha_nac": "1999-02-14",
            "direccion": "Calle Santa Rosa 789, La Florida",
            "fono": "944556677",
            "apodo": "Die"
        },
        {
            "user": users[6],
            "run": 55667788,
            "dv": "9",
            "nombres": "Valentina Paz",
            "apelpat": "Hernández",
            "apelmat": "Rojas",
            "email": "valentina.hernandez@gmail.com",
            "fecha_nac": "2001-08-30",
            "direccion": "Pasaje El Sol 123, Maipú",
            "fono": "955667788",
            "apodo": "Vale"
        },
        {
            "user": users[7],
            "run": 66778899,
            "dv": "0",
            "nombres": "Felipe Ignacio",
            "apelpat": "Silva",
            "apelmat": "Contreras",
            "email": "felipe.silva@gmail.com",
            "fecha_nac": "1997-12-05",
            "direccion": "Avenida Pajaritos 456, Maipú",
            "fono": "966778899",
            "apodo": "Pipe"
        }
    ]
    
    created_personas = []
    for data in personas_data:
        persona, created = Persona.objects.get_or_create(
            usu_id=data["user"],
            defaults={
                'per_run': data["run"],
                'per_dv': data["dv"],
                'per_nombres': data["nombres"],
                'per_apelpat': data["apelpat"],
                'per_apelmat': data["apelmat"],
                'per_email': data["email"],
                'per_fecha_nac': datetime.strptime(data["fecha_nac"], '%Y-%m-%d'),
                'per_direccion': data["direccion"],
                'per_tipo_fono': 1,
                'per_fono': data["fono"],
                'per_apodo': data["apodo"],
                'esc_id': estado_civil,
                'com_id': comuna,
                'per_vigente': True
            }
        )
        if created:
            print(f"  ✓ Persona: {data['nombres']} {data['apelpat']}")
        created_personas.append(persona)
    
    return created_personas

def create_cursos(users, personas):
    """Create cursos"""
    print("Creating cursos...")
    
    tipo_curso = TipoCurso.objects.first()
    comuna = Comuna.objects.first()
    cargo = Cargo.objects.first()
    
    # Coordinador persona
    coordinador_user = users[0]
    coordinador_persona = personas[0]
    
    cursos_data = [
        {
            "codigo": "CFB-2024-001",
            "descripcion": "Curso de Formación Básica - Marzo 2024",
            "observacion": "Incluye fundamentos del método scout, pedagogía y primeros auxilios",
            "fecha_solicitud": datetime.now() - timedelta(days=10),
            "administra": 1,
            "cuota_con_almuerzo": Decimal("45000.00"),
            "cuota_sin_almuerzo": Decimal("38000.00"),
            "modalidad": 1,
            "tipo_curso": 1,
            "lugar": "Centro Scout Regional - Santiago Centro",
            "estado": 1
        },
        {
            "codigo": "CFI-2024-002",
            "descripcion": "Curso de Formación Intermedia - Abril 2024",
            "observacion": "Profundización en técnicas scout y liderazgo de equipo",
            "fecha_solicitud": datetime.now() - timedelta(days=8),
            "administra": 1,
            "cuota_con_almuerzo": Decimal("65000.00"),
            "cuota_sin_almuerzo": Decimal("55000.00"),
            "modalidad": 1,
            "tipo_curso": 2,
            "lugar": "Campamento La Esperanza - Cajón del Maipo",
            "estado": 1
        },
        {
            "codigo": "TAL-2024-003",
            "descripcion": "Taller de Técnicas de Campamento",
            "observacion": "Construcciones scout, cocina al aire libre y supervivencia",
            "fecha_solicitud": datetime.now() - timedelta(days=5),
            "administra": 1,
            "cuota_con_almuerzo": Decimal("25000.00"),
            "cuota_sin_almuerzo": Decimal("20000.00"),
            "modalidad": 1,
            "tipo_curso": 1,
            "lugar": "Campamento Scout - Melipilla",
            "estado": 1
        },
        {
            "codigo": "TAL-2024-004",
            "descripcion": "Taller de Primeros Auxilios Avanzados",
            "observacion": "Certificación RCP y manejo de emergencias en terreno",
            "fecha_solicitud": datetime.now() - timedelta(days=3),
            "administra": 1,
            "cuota_con_almuerzo": Decimal("35000.00"),
            "cuota_sin_almuerzo": Decimal("30000.00"),
            "modalidad": 1,
            "tipo_curso": 1,
            "lugar": "Cruz Roja Chilena - Santiago",
            "estado": 1
        }
    ]
    
    created_cursos = []
    for data in cursos_data:
        curso, created = Curso.objects.get_or_create(
            cur_codigo=data["codigo"],
            defaults={
                'usu_id': coordinador_user,
                'tcu_id': tipo_curso,
                'per_id_responsable': coordinador_persona,
                'car_id_responsable': cargo,
                'com_id_lugar': comuna,
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
            print(f"  ✓ Curso: {data['codigo']} - {data['descripcion']}")
            
            # Create curso sections
            rama = Rama.objects.first()
            seccion, _ = CursoSeccion.objects.get_or_create(
                cur_id=curso,
                cus_seccion=1,
                defaults={
                    'ram_id': rama,
                    'cus_cant_participante': 30
                }
            )
            
            # Create curso dates
            hoy = datetime.now().date()
            CursoFecha.objects.get_or_create(
                cur_id=curso,
                defaults={
                    'cuf_fecha_inicio': datetime.combine(hoy + timedelta(days=30), datetime.min.time()),
                    'cuf_fecha_termino': datetime.combine(hoy + timedelta(days=32), datetime.min.time()),
                    'cuf_tipo': 1
                }
            )
            
        created_cursos.append(curso)
    
    return created_cursos

def create_proveedores():
    """Create proveedores"""
    print("Creating proveedores...")
    
    proveedores_data = [
        {
            "descripcion": "Centro de Convenciones Scouts Chile S.A.",
            "direccion": "Avenida Vicuña Mackenna 456, Santiago",
            "celular1": "+56222334455",
            "celular2": "+56222334456",
            "observacion": "Proveedor de espacios para eventos y convenciones"
        },
        {
            "descripcion": "Catering y Alimentación Scout Ltda.",
            "direccion": "Calle Matucana 789, Estación Central",
            "celular1": "+56223344556",
            "celular2": "+56223344557",
            "observacion": "Servicio de catering para cursos y actividades"
        },
        {
            "descripcion": "Librería y Materiales Didácticos Scouts",
            "direccion": "Avenida Providencia 1234, Providencia",
            "celular1": "+56224455667",
            "celular2": "+56224455668",
            "observacion": "Venta de materiales educativos y uniformes"
        },
        {
            "descripcion": "Transporte y Logística Scouts S.A.",
            "direccion": "Calle San Diego 567, Santiago",
            "celular1": "+56225566778",
            "celular2": "+56225566779",
            "observacion": "Servicio de transporte para campamentos y salidas"
        }
    ]
    
    created = []
    for data in proveedores_data:
        proveedor, was_created = Proveedor.objects.get_or_create(
            prv_descripcion=data["descripcion"],
            defaults={
                'prv_direccion': data["direccion"],
                'prv_celular1': data["celular1"],
                'prv_celular2': data["celular2"],
                'prv_observacion': data["observacion"],
                'prv_vigente': True
            }
        )
        if was_created:
            print(f"  ✓ Proveedor: {data['descripcion']}")
        created.append(proveedor)
    
    return created

def create_inscripciones(personas, cursos):
    """Create inscripciones"""
    print("Creating inscripciones...")
    
    rol = Rol.objects.first()
    nivel = Nivel.objects.first()
    alimentacion = Alimentacion.objects.first()
    
    # Inscribir participantes (personas 3-7) en cursos
    participantes = personas[3:8]
    
    count = 0
    for curso in cursos[:2]:  # First 2 courses
        seccion = CursoSeccion.objects.filter(cur_id=curso).first()
        if not seccion:
            continue
            
        for persona in participantes:
            inscripcion, created = PersonaCurso.objects.get_or_create(
                per_id=persona,
                cus_id=seccion,
                defaults={
                    'rol_id': rol,
                    'niv_id': nivel,
                    'ali_id': alimentacion,
                    'pec_observacion': f"Inscripción regular a {curso.cur_descripcion}",
                    'pec_registro': True,
                    'pec_acreditado': False
                }
            )
            if created:
                count += 1
                # Create estado
                PersonaEstadoCurso.objects.get_or_create(
                    pec_id=inscripcion,
                    defaults={
                        'usu_id': persona.usu_id,
                        'peu_fecha_hora': datetime.now(),
                        'peu_estado': 4,  # Inscrito
                        'peu_vigente': True
                    }
                )
    
    print(f"  ✓ {count} inscripciones created")

def main():
    print("\n" + "="*70)
    print("🏕️  POPULATING COMPREHENSIVE DATA - GIC Sistema Scout")
    print("="*70 + "\n")
    
    try:
        users = create_usuarios()
        personas = create_personas(users)
        cursos = create_cursos(users, personas)
        proveedores = create_proveedores()
        create_inscripciones(personas, cursos)
        
        print("\n" + "="*70)
        print("✅ Data population completed successfully!")
        print("="*70 + "\n")
        
        print("📊 Final database stats:")
        print(f"  Usuarios: {Usuario.objects.count()}")
        print(f"  Personas: {Persona.objects.count()}")
        print(f"  Cursos: {Curso.objects.count()}")
        print(f"  Inscripciones: {PersonaCurso.objects.count()}")
        print(f"  Proveedores: {Proveedor.objects.count()}")
        print()
        
        print("🔑 User credentials (all passwords: scout123):")
        for user in Usuario.objects.all():
            print(f"  {user.usu_username}")
        print()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
