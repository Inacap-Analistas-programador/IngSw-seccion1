from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import (
    CustomTokenObtainPairView,
    login_view,
    logout_view,
    me_view,
    csrf_token_view,
)

urlpatterns = [
    # Autenticación JWT
    path('login/', login_view, name='auth-login'),
    path('logout/', logout_view, name='auth-logout'),
    path('me/', me_view, name='auth-me'),
    path('csrf-token/', csrf_token_view, name='csrf-token'),
    
    # JWT Token endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
