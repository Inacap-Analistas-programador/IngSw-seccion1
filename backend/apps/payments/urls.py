from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'payments'

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    # Will be implemented in Sprint N2 - SGICS-501, SGICS-502
]