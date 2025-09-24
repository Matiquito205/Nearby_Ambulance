from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('nearest/', views.nearest_ambulance, name='nearest'),
]
