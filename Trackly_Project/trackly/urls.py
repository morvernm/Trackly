from django.urls import path
from Trackly_Project.trackly import views
app_name = 'trackly'
urlpatterns = [
path('', views.index, name='index'),
]