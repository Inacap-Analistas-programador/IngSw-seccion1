from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.CursoViewSet, basename='cursos')
router.register(r'secciones', views.CursoSeccionViewSet)
router.register(r'coordinadores', views.CursoCoordinadorViewSet)
router.register(r'cuotas', views.CursoCuotaViewSet)
router.register(r'fechas', views.CursoFechaViewSet)
router.register(r'formadores', views.CursoFormadorViewSet)
router.register(r'alimentaciones', views.CursoAlimentacionViewSet)

urlpatterns = [
    path('dashboard-stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
