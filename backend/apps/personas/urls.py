from rest_framework import routers
from .views import PersonaViewSet

router = routers.DefaultRouter()
router.register(r'personas', PersonaViewSet)
urlpatterns = router.urls
