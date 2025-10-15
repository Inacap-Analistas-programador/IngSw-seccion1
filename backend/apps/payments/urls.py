from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PagoViewSet

app_name = "payments"

router = DefaultRouter()
router.register(r"", PagoViewSet, basename="payments")

urlpatterns = [
    path("", include(router.urls)),
    # Will be implemented in Sprint N2 - SGICS-501, SGICS-502
]
