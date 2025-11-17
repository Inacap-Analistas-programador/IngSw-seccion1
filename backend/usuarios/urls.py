from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    PerfilViewSet,
    AplicacionViewSet,
    PerfilAplicacionViewSet,
)
from .dashboard_views import (
    dashboard_stats,
    dashboard_payment_stats,
    dashboard_recent_courses,
    dashboard_recent_activity,
    dashboard_executive_stats,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'perfiles', PerfilViewSet)
router.register(r'aplicaciones', AplicacionViewSet)
router.register(r'perfil-aplicaciones', PerfilAplicacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('dashboard/payment-stats/', dashboard_payment_stats, name='dashboard-payment-stats'),
    path('dashboard/recent-courses/', dashboard_recent_courses, name='dashboard-recent-courses'),
    path('dashboard/recent-activity/', dashboard_recent_activity, name='dashboard-recent-activity'),
    path('dashboard/executive-stats/', dashboard_executive_stats, name='dashboard-executive-stats'),
]
