from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "preinscriptions"

router = DefaultRouter()
# router.register(r'', views.PreinscriptionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    # Will be implemented in Sprint N2 - SGICS-401
    # path('', views.PreinscriptionViewSet.as_view({'get': 'list', 'post': 'create'})),
    # path('search-person/', views.PersonSearchView.as_view(), name='search-person'),
]
