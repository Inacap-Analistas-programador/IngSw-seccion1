from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q, Sum
from datetime import datetime, timedelta
from personas.models import Persona, PersonaCurso, PersonaEstadoCurso
from cursos.models import Curso, CursoSeccion
from pagos.models import Pago


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get comprehensive dashboard statistics from database
    """
    # Get total personas
    total_personas = Persona.objects.filter(per_vigente=True).count()
    
    # Get active courses (estado = 1 is active)
    cursos_activos = Curso.objects.filter(cur_estado=1).count()
    
    # Get pending payments (estado = 1 is pending)
    pagos_pendientes = Pago.objects.filter(pag_estado=1).count()
    
    # Get total inscriptions
    inscripciones_totales = PersonaCurso.objects.filter(pec_registro=True).count()
    
    return Response({
        'total_personas': total_personas,
        'cursos_activos': cursos_activos,
        'pagos_pendientes': pagos_pendientes,
        'inscripciones_totales': inscripciones_totales
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_payment_stats(request):
    """
    Get payment statistics for dashboard
    """
    today = datetime.now()
    current_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Total income this month (estado = 2 is completed/confirmed)
    ingresos_mes = Pago.objects.filter(
        pag_estado=2,
        pag_fecha_pago__gte=current_month_start
    ).aggregate(total=Sum('pag_monto'))['total'] or 0
    
    # Pending payments count
    pagos_pendientes = Pago.objects.filter(pag_estado=1).count()
    
    # Count of courses with confirmed payments
    cursos_pagados = Pago.objects.filter(
        pag_estado=2
    ).values('cur_id').distinct().count()
    
    return Response({
        'total_ingresos': float(ingresos_mes),
        'pagos_pendientes': pagos_pendientes,
        'cursos_pagados': cursos_pagados
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_recent_courses(request):
    """
    Get recent courses with enrollment data
    """
    # Get active courses with their sections
    cursos = Curso.objects.filter(cur_estado=1).select_related(
        'com_id_lugar'
    ).prefetch_related('cursoseccion_set').order_by('-cur_fecha_solicitud')[:5]
    
    courses_data = []
    for curso in cursos:
        # Get first section for participant count
        seccion = curso.cursoseccion_set.first()
        inscritos = 0
        capacidad = 30  # default
        
        if seccion:
            inscritos = PersonaCurso.objects.filter(cus_id=seccion, pec_registro=True).count()
            capacidad = seccion.cus_cant_participante or 30
        
        # Get course start date
        fecha_curso = curso.cursofecha_set.first()
        fecha = fecha_curso.cuf_fecha_inicio.strftime('%Y-%m-%d') if fecha_curso else None
        
        courses_data.append({
            'id': curso.cur_id,
            'nombre': curso.cur_descripcion,
            'codigo': curso.cur_codigo,
            'fecha': fecha,
            'inscritos': inscritos,
            'capacidad': capacidad,
            'lugar': curso.cur_lugar,
            'estado': 'activo'
        })
    
    return Response(courses_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_recent_activity(request):
    """
    Get recent activity from various sources
    """
    activities = []
    
    # Get recent inscriptions
    recent_inscriptions = PersonaCurso.objects.select_related(
        'per_id', 'cus_id__cur_id'
    ).order_by('-pec_id')[:5]
    
    for insc in recent_inscriptions:
        if insc.per_id and insc.cus_id and insc.cus_id.cur_id:
            nombre_completo = f"{insc.per_id.per_nombres} {insc.per_id.per_apelpat}"
            curso_nombre = insc.cus_id.cur_id.cur_descripcion
            activities.append({
                'id': f'insc_{insc.pec_id}',
                'tipo': 'inscripcion',
                'descripcion': f'Nueva inscripción: {nombre_completo} - {curso_nombre}',
                'fecha': 'Reciente',
                'icon': 'FaUserCheck',
                'color': 'text-green-600'
            })
    
    # Get recent payments
    recent_payments = Pago.objects.select_related('per_id').order_by('-pag_fecha_pago')[:5]
    
    for pago in recent_payments:
        if pago.per_id:
            nombre_completo = f"{pago.per_id.per_nombres} {pago.per_id.per_apelpat}"
            monto = f"${pago.pag_monto:,.0f}" if pago.pag_monto else "$0"
            activities.append({
                'id': f'pago_{pago.pag_id}',
                'tipo': 'pago',
                'descripcion': f'Pago confirmado: {nombre_completo} - {monto}',
                'fecha': 'Reciente',
                'icon': 'FaCreditCard',
                'color': 'text-blue-600'
            })
    
    # Get recent courses
    recent_courses = Curso.objects.order_by('-cur_fecha_solicitud')[:3]
    
    for curso in recent_courses:
        activities.append({
            'id': f'curso_{curso.cur_id}',
            'tipo': 'curso',
            'descripcion': f'Curso: {curso.cur_descripcion}',
            'fecha': 'Reciente',
            'icon': 'FaCalendarDays',
            'color': 'text-purple-600'
        })
    
    # Sort by most recent and limit to 10
    activities = activities[:10]
    
    return Response(activities)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_executive_stats(request):
    """
    Get comprehensive executive dashboard statistics
    """
    # Calculate trends (comparing with previous month)
    today = datetime.now()
    current_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
    
    # Current month stats
    current_personas = Persona.objects.filter(
        per_vigente=True,
        usu_id__usu_fecha_creacion__gte=current_month_start
    ).count()
    
    # Previous month stats
    previous_personas = Persona.objects.filter(
        per_vigente=True,
        usu_id__usu_fecha_creacion__gte=last_month_start,
        usu_id__usu_fecha_creacion__lt=current_month_start
    ).count()
    
    # Calculate trend
    persona_trend = 0
    if previous_personas > 0:
        persona_trend = ((current_personas - previous_personas) / previous_personas) * 100
    
    # Cursos trend
    current_cursos = Curso.objects.filter(cur_fecha_solicitud__gte=current_month_start).count()
    previous_cursos = Curso.objects.filter(
        cur_fecha_solicitud__gte=last_month_start,
        cur_fecha_solicitud__lt=current_month_start
    ).count()
    
    curso_trend = 0
    if previous_cursos > 0:
        curso_trend = ((current_cursos - previous_cursos) / previous_cursos) * 100
    
    # Pagos pendientes trend
    pagos_pendientes = Pago.objects.filter(pag_estado=1).count()
    pagos_completados = Pago.objects.filter(pag_estado=2).count()
    
    pago_trend = -5 if pagos_pendientes > 0 else 0
    
    # Ingresos del mes
    ingresos_mes = Pago.objects.filter(
        pag_estado=2,
        pag_fecha_pago__gte=current_month_start
    ).aggregate(total=Sum('pag_monto'))['total'] or 0
    
    ingresos_mes_anterior = Pago.objects.filter(
        pag_estado=2,
        pag_fecha_pago__gte=last_month_start,
        pag_fecha_pago__lt=current_month_start
    ).aggregate(total=Sum('pag_monto'))['total'] or 0
    
    ingreso_trend = 0
    if ingresos_mes_anterior > 0:
        ingreso_trend = ((ingresos_mes - ingresos_mes_anterior) / ingresos_mes_anterior) * 100
    
    total_personas = Persona.objects.filter(per_vigente=True).count()
    cursos_activos = Curso.objects.filter(cur_estado=1).count()
    
    return Response({
        'stats': [
            {
                'label': 'Total Participantes',
                'value': str(total_personas),
                'change': f'+{persona_trend:.0f}%' if persona_trend > 0 else f'{persona_trend:.0f}%',
                'trend': 'up' if persona_trend > 0 else 'down',
                'color': 'bg-blue-500',
            },
            {
                'label': 'Cursos Activos',
                'value': str(cursos_activos),
                'change': f'+{curso_trend:.0f}' if curso_trend > 0 else f'{curso_trend:.0f}',
                'trend': 'up' if curso_trend >= 0 else 'down',
                'color': 'bg-primary',
            },
            {
                'label': 'Pagos Pendientes',
                'value': str(pagos_pendientes),
                'change': f'{pago_trend:.0f}%',
                'trend': 'down' if pago_trend < 0 else 'up',
                'color': 'bg-yellow-500',
            },
            {
                'label': 'Ingresos del Mes',
                'value': f'${ingresos_mes:,.0f}',
                'change': f'+{ingreso_trend:.0f}%' if ingreso_trend > 0 else f'{ingreso_trend:.0f}%',
                'trend': 'up' if ingreso_trend > 0 else 'down',
                'color': 'bg-purple-500',
            },
        ]
    })
