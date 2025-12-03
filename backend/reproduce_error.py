import os
import django
from django.conf import settings
from datetime import datetime, timedelta
from django.db.models import Count, Sum

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

from pagos.models import PagoPersona
from cursos.models import Curso
from personas.models import PersonaCurso

def test_queries():
    print("Testing queries...")
    today = datetime.now()
    current_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    try:
        print("1. Testing ingresos_mes...")
        ingresos_mes = PagoPersona.objects.filter(
            pap_tipo=1,
            pap_fecha_hora__gte=current_month_start
        ).aggregate(total=Sum('pap_valor'))['total'] or 0
        print(f"Success: {ingresos_mes}")
    except Exception as e:
        print(f"Error in 1: {e}")

    try:
        print("2. Testing pagos_pendientes...")
        pagos_pendientes = PagoPersona.objects.all().count()
        print(f"Success: {pagos_pendientes}")
    except Exception as e:
        print(f"Error in 2: {e}")

    try:
        print("3. Testing cursos_pagados...")
        cursos_pagados = PagoPersona.objects.values('cur_id').distinct().count()
        print(f"Success: {cursos_pagados}")
    except Exception as e:
        print(f"Error in 3: {e}")

    try:
        print("4. Testing balance_stats loop...")
        for i in range(1):
            date = today - timedelta(days=i*30)
            month_start = date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_end = date.replace(month=date.month+1, day=1, hour=0, minute=0, second=0, microsecond=0) if date.month < 12 else date.replace(year=date.year+1, month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            
            ingresos = PagoPersona.objects.filter(
                pap_tipo=1,
                pap_fecha_hora__gte=month_start,
                pap_fecha_hora__lt=month_end
            ).aggregate(total=Sum('pap_valor'))['total'] or 0
        print("Success loop")
    except Exception as e:
        print(f"Error in 4: {e}")

    try:
        print("5. Testing vigentes/por_acreditar...")
        vigentes = PersonaCurso.objects.filter(pec_registro=True, pec_acreditado=True).count()
        print(f"Success: {vigentes}")
    except Exception as e:
        print(f"Error in 5: {e}")

    try:
        print("6. Testing cursos_populares...")
        cursos_populares = Curso.objects.annotate(
            total_inscritos=Count('cursoseccion__personacurso')
        ).order_by('-total_inscritos')[:5]
        print(f"Success query construction")
        for curso in cursos_populares:
            print(f"Curso: {curso.cur_codigo}")
            course_vigentes = PersonaCurso.objects.filter(
                cus_id__cur_id=curso.cur_id, 
                pec_registro=True, 
                pec_acreditado=True
            ).count()
    except Exception as e:
        print(f"Error in 6: {e}")

if __name__ == "__main__":
    test_queries()
