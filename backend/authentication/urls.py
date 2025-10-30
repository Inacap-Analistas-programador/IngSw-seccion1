from django.urls import path
from .views import PersonSearchView

urlpatterns = [
    path('persons/search/', PersonSearchView.as_view(), name='persons-search'),
]
