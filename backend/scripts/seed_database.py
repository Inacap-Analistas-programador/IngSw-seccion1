#!/usr/bin/env python
"""
Script para inicializar la base de datos con datos de prueba
GIC - Plataforma de Gestión Integral de Cursos

Uso:
    python manage.py shell < scripts/seed_database.py
    o
    python scripts/seed_database.py
"""
import os
import sys
import django

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
        "Magallanes"
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
    
    # Algunas provincias de ejemplo
    region_metropolitana = Region.objects.get(reg_descripcion="Metropolitana de Santiago")
    provincias_rm = [
        "Santiago", "Cordillera", "Chacabuco", "Maipo", 
        "Melipilla", "Talagante"
    ]
    
    for nombre in provincias_rm:
        provincia, created = Provincia.objects.get_or_create(
            reg_id=region_metropolitana,
            pro_descripcion=nombre,
            defaults={'pro_vigente': True}
        )
        if created:
            print(f"  ✓ Provincia: {nombre}")
    
    # Algunas comunas de Santiago
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
        {"nombre": "Zona Norte", "unilateral": False},
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
    
    # Crear algunos distritos
    zona_metropolitana = Zona.objects.get(zon_descripcion="Zona Metropolitana")
    distritos_rm = [
        "Distrito Santiago Centro",
        "Distrito Santiago Oriente",
        "Distrito Santiago Sur",
        "Distrito Santiago Norte",
        "Distrito Santiago Poniente"
    ]
    
    for nombre in distritos_rm:
        distrito, created = Distrito.objects.get_or_create(
            zon_id=zona_metropolitana,
            dis_descripcion=nombre,
            defaults={'dis_vigente': True}
        )
        if created:
            print(f"  ✓ Distrito: {nombre}")
    
    # Crear algunos grupos scouts
    distrito_centro = Distrito.objects.get(
        zon_id=zona_metropolitana,
        dis_descripcion="Distrito Santiago Centro"
    )
    
    grupos = [
        "Grupo Scout N°1 San Jorge",
        "Grupo Scout N°42 Baden Powell",
        "Grupo Scout N°15 Exploradores",
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
        "Dirigente", "Formador", "Coordinador",
        "Jefe de Grupo", "Comisionado", "Asesor"
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
        {"nombre": "Castores", "edad_min": 5, "edad_max": 7},
        {"nombre": "Lobatos", "edad_min": 8, "edad_max": 10},
        {"nombre": "Scouts", "edad_min": 11, "edad_max": 14},
        {"nombre": "Pioneros", "edad_min": 15, "edad_max": 17},
        {"nombre": "Rovers", "edad_min": 18, "edad_max": 21},
    ]
    for data in ramas:
        obj, created = Rama.objects.get_or_create(
            ram_descripcion=data["nombre"],
            defaults={
                'ram_edad_minima': data["edad_min"],
                'ram_edad_maxima': data["edad_max"],
                'ram_vigente': True
            }
        )
        if created:
            print(f"  ✓ Rama: {data['nombre']} ({data['edad_min']}-{data['edad_max']} años)")
    
    # Niveles
    niveles = [
        "Nivel Básico", "Nivel Intermedio", "Nivel Avanzado",
        "Nivel Formador"
    ]
    for nombre in niveles:
        obj, created = Nivel.objects.get_or_create(
            niv_descripcion=nombre,
            defaults={'niv_vigente': True}
        )
        if created:
            print(f"  ✓ Nivel: {nombre}")
    
    # Roles
    roles = [
        "Participante", "Instructor", "Coordinador", 
        "Observador", "Staff"
    ]
    for nombre in roles:
        obj, created = Rol.objects.get_or_create(
            rol_descripcion=nombre,
            defaults={'rol_vigente': True}
        )
        if created:
            print(f"  ✓ Rol: {nombre}")
    
    # Tipos de archivo
    tipos_archivo = [
        "Certificado", "Fotografía", "Documento",
        "Planilla", "Informe"
    ]
    for nombre in tipos_archivo:
        obj, created = TipoArchivo.objects.get_or_create(
            tar_descripcion=nombre,
            defaults={'tar_vigente': True}
        )
        if created:
            print(f"  ✓ Tipo Archivo: {nombre}")
    
    # Tipos de curso
    tipos_curso = [
        "Curso de Formación", "Taller", "Capacitación",
        "Seminario", "Campamento", "Actividad Especial"
    ]
    for nombre in tipos_curso:
        obj, created = TipoCurso.objects.get_or_create(
            tcu_descripcion=nombre,
            defaults={'tcu_vigente': True}
        )
        if created:
            print(f"  ✓ Tipo Curso: {nombre}")
    
    # Tipos de alimentación
    alimentaciones = [
        {"tipo": 1, "descripcion": "Desayuno"},
        {"tipo": 2, "descripcion": "Almuerzo"},
        {"tipo": 3, "descripcion": "Once"},
        {"tipo": 4, "descripcion": "Cena"},
        {"tipo": 5, "descripcion": "Colación"},
    ]
    for data in alimentaciones:
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
        "Inscripción", "Matrícula", "Cuota Mensual",
        "Material", "Transporte", "Alimentación",
        "Certificación", "Otros"
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
            usu_apellido_materno='GIC'
        )
        print(f"  ✓ Usuario Admin: admin / admin123")
    
    # Usuario dirigente
    if not User.objects.filter(username='dirigente').exists():
        dirigente = User.objects.create_user(
            username='dirigente',
            email='dirigente@scouts.cl',
            password='dirigente123',
            usu_nombre='Carlos',
            usu_apellido_paterno='Dirigente',
            usu_apellido_materno='Scout'
        )
        print(f"  ✓ Usuario Dirigente: dirigente / dirigente123")
    
    # Usuario coordinador
    if not User.objects.filter(username='coordinador').exists():
        coordinador = User.objects.create_user(
            username='coordinador',
            email='coordinador@scouts.cl',
            password='coord123',
            usu_nombre='María',
            usu_apellido_paterno='Coordinadora',
            usu_apellido_materno='Cursos'
        )
        print(f"  ✓ Usuario Coordinador: coordinador / coord123")
    
    print("✓ Usuarios completados\n")


def main():
    """Función principal de seeding"""
    print("\n" + "="*60)
    print("🏕️  SEED DATABASE - GIC Sistema Scout")
    print("="*60 + "\n")
    
    try:
        seed_geografia()
        seed_zonas_scouts()
        seed_maestros()
        seed_usuarios()
        
        print("="*60)
        print("✅ Database seeding completado exitosamente!")
        print("="*60 + "\n")
        
        print("📝 Credenciales de acceso:")
        print("  Admin:       admin / admin123")
        print("  Dirigente:   dirigente / dirigente123")
        print("  Coordinador: coordinador / coord123")
        print()
        
    except Exception as e:
        print(f"\n❌ Error durante el seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
