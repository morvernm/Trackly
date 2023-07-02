from django.urls import path
from .views import ReviewList, SingleReview

app_name = 'trackly_api'

urlpatterns = [
    path('<int:pk>/', SingleReview.as_view(), name='reviewCreate'), # show a single review
    path('', ReviewList.as_view(), name='listCreate'), # show all reviews - data in database
]