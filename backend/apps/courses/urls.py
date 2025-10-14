from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'courses'

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'teams', views.CourseTeamViewSet)
router.register(r'', views.CourseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]