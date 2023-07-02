from django.urls import path
from trackly import views

app_name = 'trackly'
urlpatterns = [
path('', views.index, name='index'),
]