from django.urls import path
from . import views

app_name = "authentication"

urlpatterns = [
    # Implementacion del Sprint 2
    # path('logout/', views.LogoutView.as_view(), name='logout'),
    # path('roles/', views.RoleViewSet.as_view({'get': 'list', 'post': 'create'}), name='roles'),
]
