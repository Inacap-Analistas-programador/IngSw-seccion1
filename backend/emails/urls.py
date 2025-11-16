from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmailTemplateViewSet,
    EmailLogViewSet,
    EmailConfigurationViewSet,
    EmailQueueViewSet,
    EmailSendViewSet,
)

router = DefaultRouter()
router.register(r'templates', EmailTemplateViewSet, basename='email-template')
router.register(r'logs', EmailLogViewSet, basename='email-log')
router.register(r'configurations', EmailConfigurationViewSet, basename='email-configuration')
router.register(r'queue', EmailQueueViewSet, basename='email-queue')
router.register(r'send', EmailSendViewSet, basename='email-send')

urlpatterns = [
    path('', include(router.urls)),
]
