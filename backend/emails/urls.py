from django.urls import path
from .views import EmailForwarderView

urlpatterns = [
    path('email-forwarder/', EmailForwarderView.as_view(), name='email-forwarder'),
]
