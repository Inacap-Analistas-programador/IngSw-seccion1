#!/usr/bin/env python
"""
Script para crear datos de prueba en SGICS
"""
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouts_platform.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from personas.models import Persona, TipoCargo, TipoPersona, Rama
from cursos.models import Curso, TipoCurso, EstadoCurso, Participante, EstadoParticipante
from catalog.models import Region, Provincia, Comuna
from payments.models import Pago, EstadoPago, TipoPago

User = get_user_model()

def create_superuser():
    """Crear superusuario admin"""
    print("Creando superusuario...")
    if not User.objects.filter(username='admin').exists():
        user = User.objects.create_superuser(
            username='admin',
            email='admin@sgics.local',
            password='admin123'
        )
        print(f"✓ Superusuario creado: admin / admin123")
    else:
        print("✓ Superusuario ya existe")

def create_catalogs():
    """Crear catálogos básicos"""
    print("\nCreando catálogos...")
    
    # Regiones
    if not Region.objects.exists():
        region_biobio = Region.objects.create(codigo='VIII', descripcion='Bío-Bío')
        provincia_concepcion = Provincia.objects.create(
            region=region_biobio,
            codigo='081',
            descripcion='Concepción'
        )
        Comuna.objects.create(
            provincia=provincia_concepcion,
            codigo='08101',
            descripcion='Concepción'
        )
        print("✓ Regiones, provincias y comunas creadas")
    
    # Tipos de Cargo
    if not TipoCargo.objects.exists():
        TipoCargo.objects.bulk_create([
            TipoCargo(descripcion='Director/a'),
            TipoCargo(descripcion='Coordinador/a'),
            TipoCargo(descripcion='Instructor/a'),
            TipoCargo(descripcion='Guía'),
            TipoCargo(descripcion='Scout'),
        ])
        print("✓ Tipos de cargo creados")
    
    # Tipos de Persona
    if not TipoPersona.objects.exists():
        TipoPersona.objects.bulk_create([
            TipoPersona(descripcion='Beneficiario'),
            TipoPersona(descripcion='Staff'),
            TipoPersona(descripcion='Instructor'),
        ])
        print("✓ Tipos de persona creados")
    
    # Ramas
    if not Rama.objects.exists():
        Rama.objects.bulk_create([
            Rama(descripcion='Manada', edad_minima=7, edad_maxima=11),
            Rama(descripcion='Tropa', edad_minima=11, edad_maxima=15),
            Rama(descripcion='Comunidad', edad_minima=15, edad_maxima=18),
            Rama(descripcion='Clan', edad_minima=18, edad_maxima=21),
        ])
        print("✓ Ramas creadas")
    
    # Tipos de Curso
    if not TipoCurso.objects.exists():
        TipoCurso.objects.bulk_create([
            TipoCurso(descripcion='Curso Básico'),
            TipoCurso(descripcion='Curso Intermedio'),
            TipoCurso(descripcion='Curso Avanzado'),
            TipoCurso(descripcion='Capacitación'),
        ])
        print("✓ Tipos de curso creados")
    
    # Estados de Curso
    if not EstadoCurso.objects.exists():
        EstadoCurso.objects.bulk_create([
            EstadoCurso(descripcion='Planificado'),
            EstadoCurso(descripcion='En Curso'),
            EstadoCurso(descripcion='Completado'),
            EstadoCurso(descripcion='Cancelado'),
        ])
        print("✓ Estados de curso creados")
    
    # Estados de Participante
    if not EstadoParticipante.objects.exists():
        EstadoParticipante.objects.bulk_create([
            EstadoParticipante(descripcion='Preinscrito'),
            EstadoParticipante(descripcion='Inscrito'),
            EstadoParticipante(descripcion='Asistió'),
            EstadoParticipante(descripcion='No Asistió'),
        ])
        print("✓ Estados de participante creados")
    
    # Tipos de Pago
    if not TipoPago.objects.exists():
        TipoPago.objects.bulk_create([
            TipoPago(descripcion='Efectivo'),
            TipoPago(descripcion='Transferencia'),
            TipoPago(descripcion='Débito'),
            TipoPago(descripcion='Crédito'),
        ])
        print("✓ Tipos de pago creados")
    
    # Estados de Pago
    if not EstadoPago.objects.exists():
        EstadoPago.objects.bulk_create([
            EstadoPago(descripcion='Pendiente'),
            EstadoPago(descripcion='Registrado'),
            EstadoPago(descripcion='Comprobado'),
            EstadoPago(descripcion='Cancelado'),
        ])
        print("✓ Estados de pago creados")

def create_personas():
    """Crear personas de prueba"""
    print("\nCreando personas...")
    
    user = User.objects.get(username='admin')
    tipo_beneficiario = TipoPersona.objects.get(descripcion='Beneficiario')
    tipo_instructor = TipoPersona.objects.get(descripcion='Instructor')
    cargo_director = TipoCargo.objects.get(descripcion='Director/a')
    comuna = Comuna.objects.first()
    
    if not Persona.objects.exists():
        # Crear instructores
        Persona.objects.bulk_create([
            Persona(
                usuario=user,
                tipo_persona=tipo_instructor,
                tipo_cargo=cargo_director,
                run='12345678-9',
                nombres='Juan',
                apellido_paterno='Pérez',
                apellido_materno='González',
                fecha_nacimiento='1985-05-15',
                email='juan.perez@sgics.local',
                telefono='56912345678',
                comuna=comuna
            ),
            Persona(
                usuario=user,
                tipo_persona=tipo_instructor,
                tipo_cargo=cargo_director,
                run='98765432-1',
                nombres='María',
                apellido_paterno='López',
                apellido_materno='Martínez',
                fecha_nacimiento='1990-08-20',
                email='maria.lopez@sgics.local',
                telefono='56987654321',
                comuna=comuna
            ),
        ])
        
        # Crear beneficiarios
        for i in range(1, 11):
            Persona.objects.create(
                usuario=user,
                tipo_persona=tipo_beneficiario,
                tipo_cargo=cargo_director,
                run=f'{10000000 + i}-K',
                nombres=f'Participante{i}',
                apellido_paterno=f'Apellido{i}',
                apellido_materno='Test',
                fecha_nacimiento=f'200{i % 10}-01-01',
                email=f'participante{i}@test.com',
                telefono=f'5691234567{i}',
                comuna=comuna
            )
        
        print(f"✓ {Persona.objects.count()} personas creadas")
    else:
        print(f"✓ Ya existen {Persona.objects.count()} personas")

def create_cursos():
    """Crear cursos de prueba"""
    print("\nCreando cursos...")
    
    user = User.objects.get(username='admin')
    tipo_curso = TipoCurso.objects.get(descripcion='Curso Básico')
    estado_curso = EstadoCurso.objects.get(descripcion='En Curso')
    responsable = Persona.objects.filter(tipo_persona__descripcion='Instructor').first()
    comuna = Comuna.objects.first()
    
    if not Curso.objects.exists():
        for i in range(1, 6):
            fecha_inicio = datetime.now() + timedelta(days=i*7)
            Curso.objects.create(
                usuario=user,
                tipo_curso=tipo_curso,
                persona_responsable=responsable,
                cargo_responsable=responsable.tipo_cargo,
                fecha_hora=fecha_inicio,
                fecha_solicitud=datetime.now(),
                nombre_curso=f'Curso de Formación Scout {i}',
                lugar=f'Centro Scout {i}',
                direccion_lugar=f'Calle Ejemplo {i}00',
                comuna_lugar=comuna,
                cantidad_participantes=20 + i*5,
                rama=None,
                estado=estado_curso,
                costo_curso=Decimal('50000.00'),
                cuotas=2,
                valor_cuota=Decimal('25000.00')
            )
        
        print(f"✓ {Curso.objects.count()} cursos creados")
    else:
        print(f"✓ Ya existen {Curso.objects.count()} cursos")

def create_participantes():
    """Crear participantes en cursos"""
    print("\nCreando participantes...")
    
    estado_inscrito = EstadoParticipante.objects.get(descripcion='Inscrito')
    cursos = Curso.objects.all()[:3]
    personas = Persona.objects.filter(tipo_persona__descripcion='Beneficiario')[:8]
    
    if not Participante.objects.exists():
        for curso in cursos:
            for i, persona in enumerate(personas[:5]):
                Participante.objects.create(
                    curso=curso,
                    persona=persona,
                    estado=estado_inscrito,
                    fecha_inscripcion=datetime.now() - timedelta(days=i)
                )
        
        print(f"✓ {Participante.objects.count()} participantes creados")
    else:
        print(f"✓ Ya existen {Participante.objects.count()} participantes")

def create_pagos():
    """Crear pagos de prueba"""
    print("\nCreando pagos...")
    
    tipo_transferencia = TipoPago.objects.get(descripcion='Transferencia')
    estado_registrado = EstadoPago.objects.get(descripcion='Registrado')
    participantes = Participante.objects.all()[:10]
    
    if not Pago.objects.exists():
        for participante in participantes:
            Pago.objects.create(
                participante=participante,
                tipo_pago=tipo_transferencia,
                monto=Decimal('25000.00'),
                fecha_pago=datetime.now() - timedelta(days=5),
                estado=estado_registrado,
                numero_cuota=1
            )
        
        print(f"✓ {Pago.objects.count()} pagos creados")
    else:
        print(f"✓ Ya existen {Pago.objects.count()} pagos")

def main():
    print("=" * 60)
    print("CREACIÓN DE DATOS DE PRUEBA PARA SGICS")
    print("=" * 60)
    
    try:
        create_superuser()
        create_catalogs()
        create_personas()
        create_cursos()
        create_participantes()
        create_pagos()
        
        print("\n" + "=" * 60)
        print("✓ DATOS DE PRUEBA CREADOS EXITOSAMENTE")
        print("=" * 60)
        print("\nCredenciales de acceso:")
        print("  Usuario: admin")
        print("  Contraseña: admin123")
        print("\nDatos creados:")
        print(f"  - {Persona.objects.count()} personas")
        print(f"  - {Curso.objects.count()} cursos")
        print(f"  - {Participante.objects.count()} participantes")
        print(f"  - {Pago.objects.count()} pagos")
        print("\nFrontend: http://localhost:5173")
        print("Backend: http://localhost:8000")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
