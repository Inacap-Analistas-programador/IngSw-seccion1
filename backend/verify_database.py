#!/usr/bin/env python
"""
Verification script for GIC database population.
This script verifies that the database has been properly populated with all required data.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scout_project.settings")
django.setup()

from maestros.models import (
    EstadoCivil, Cargo, Nivel, Rama, Rol, TipoArchivo, 
    TipoCurso, Alimentacion, ConceptoContable, Aplicacion, Perfil
)
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from usuarios.models import Usuario
from personas.models import Persona, PersonaGrupo, PersonaCurso
from cursos.models import Curso, CursoSeccion, CursoFecha
from pagos.models import PagoPersona, ComprobantePago, PagoComprobante
from proveedores.models import Proveedor


def verify_counts():
    """Verify that all tables have the expected minimum records."""
    checks = {
        'Estados Civiles': (EstadoCivil, 5),
        'Cargos': (Cargo, 10),
        'Niveles': (Nivel, 4),
        'Ramas': (Rama, 4),
        'Roles': (Rol, 5),
        'Tipos de Archivo': (TipoArchivo, 6),
        'Tipos de Curso': (TipoCurso, 5),
        'Alimentaciones': (Alimentacion, 5),
        'Conceptos Contables': (ConceptoContable, 6),
        'Aplicaciones': (Aplicacion, 3),
        'Perfiles': (Perfil, 4),
        'Regiones': (Region, 5),
        'Provincias': (Provincia, 13),
        'Comunas': (Comuna, 79),
        'Zonas': (Zona, 4),
        'Distritos': (Distrito, 5),
        'Grupos': (Grupo, 13),
        'Proveedores': (Proveedor, 3),
        'Usuarios': (Usuario, 3),
        'Personas': (Persona, 15),
        'Cursos': (Curso, 5),
        'Secciones de Curso': (CursoSeccion, 5),
        'Fechas de Curso': (CursoFecha, 5),
        'Inscripciones': (PersonaCurso, 50),
        'Pagos': (PagoPersona, 20),
        'Comprobantes': (ComprobantePago, 20),
    }
    
    all_passed = True
    print("=" * 60)
    print("DATABASE POPULATION VERIFICATION")
    print("=" * 60)
    
    for label, (model, expected) in checks.items():
        count = model.objects.count()
        status = "✓" if count >= expected else "✗"
        if count < expected:
            all_passed = False
        print(f"{status} {label}: {count} (expected >= {expected})")
    
    return all_passed


def verify_relationships():
    """Verify that relationships are working correctly."""
    print("\n" + "=" * 60)
    print("RELATIONSHIP VERIFICATION")
    print("=" * 60)
    
    checks_passed = True
    
    # Check person has comuna
    persona = Persona.objects.first()
    if persona and persona.com_id:
        print(f"✓ Persona has Comuna: {persona.per_nombres} -> {persona.com_id.com_descripcion}")
    else:
        print("✗ Persona missing Comuna relationship")
        checks_passed = False
    
    # Check person has grupo
    pg = PersonaGrupo.objects.first()
    if pg and pg.gru_id and pg.per_id:
        print(f"✓ Persona assigned to Grupo: {pg.per_id.per_nombres} -> {pg.gru_id.gru_descripcion}")
    else:
        print("✗ PersonaGrupo relationship not working")
        checks_passed = False
    
    # Check curso has responsable
    curso = Curso.objects.first()
    if curso and curso.per_id_responsable:
        print(f"✓ Curso has Responsable: {curso.cur_codigo} -> {curso.per_id_responsable.per_nombres}")
    else:
        print("✗ Curso missing Responsable relationship")
        checks_passed = False
    
    # Check curso has sections
    if curso:
        sections = CursoSeccion.objects.filter(cur_id=curso).count()
        if sections > 0:
            print(f"✓ Curso has Sections: {curso.cur_codigo} has {sections} sections")
        else:
            print(f"✗ Curso has no sections")
            checks_passed = False
    
    # Check persona enrolled in curso
    pc = PersonaCurso.objects.first()
    if pc and pc.per_id and pc.cus_id:
        print(f"✓ Persona enrolled in Curso: {pc.per_id.per_nombres} -> {pc.cus_id.cur_id.cur_codigo}")
    else:
        print("✗ PersonaCurso relationship not working")
        checks_passed = False
    
    # Check pago has persona and curso
    pago = PagoPersona.objects.first()
    if pago and pago.per_id and pago.cur_id:
        print(f"✓ Pago linked to Persona and Curso: {pago.per_id.per_nombres} -> {pago.cur_id.cur_codigo}")
    else:
        print("✗ PagoPersona relationship not working")
        checks_passed = False
    
    # Check comprobante has pago
    pc_link = PagoComprobante.objects.first()
    if pc_link and pc_link.pap_id and pc_link.cpa_id:
        print(f"✓ Comprobante linked to Pago: Pago #{pc_link.pap_id.pap_id} -> Comprobante #{pc_link.cpa_id.cpa_numero}")
    else:
        print("✗ PagoComprobante relationship not working")
        checks_passed = False
    
    return checks_passed


def show_sample_data():
    """Show sample data from the database."""
    print("\n" + "=" * 60)
    print("SAMPLE DATA")
    print("=" * 60)
    
    print("\nPersonas (first 5):")
    for p in Persona.objects.all()[:5]:
        print(f"  • {p.per_nombres} {p.per_apelpat} ({p.per_email})")
    
    print("\nCursos (all):")
    for c in Curso.objects.all():
        enrollments = PersonaCurso.objects.filter(cus_id__cur_id=c).count()
        print(f"  • {c.cur_codigo}: {c.cur_descripcion} ({enrollments} inscritos)")
    
    print("\nRegiones:")
    for r in Region.objects.all():
        provincias = Provincia.objects.filter(reg_id=r).count()
        print(f"  • {r.reg_descripcion} ({provincias} provincias)")
    
    print("\nGrupos Scouts:")
    for g in Grupo.objects.all():
        members = PersonaGrupo.objects.filter(gru_id=g).count()
        print(f"  • {g.gru_descripcion} ({members} miembros)")


def main():
    """Main verification function."""
    counts_ok = verify_counts()
    relationships_ok = verify_relationships()
    show_sample_data()
    
    print("\n" + "=" * 60)
    if counts_ok and relationships_ok:
        print("✓ ALL VERIFICATIONS PASSED")
        print("=" * 60)
        print("\nThe database is properly populated and ready to use!")
        print("You can now start the application with:")
        print("  cd backend && python manage.py runserver")
        return 0
    else:
        print("✗ SOME VERIFICATIONS FAILED")
        print("=" * 60)
        print("\nPlease run: python manage.py populate_database")
        return 1


if __name__ == '__main__':
    sys.exit(main())
