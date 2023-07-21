from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ReviewList, SingleReview, CreateUserView, BlackListTokenView


app_name = 'trackly_api'

urlpatterns = [
    path('<int:pk>/', SingleReview.as_view(), name='reviewCreate'),  # show a single review
    path('', ReviewList.as_view(), name='listCreate'),  # show all reviews - data in database
    path('register/', CreateUserView.as_view(), name='userCreate'),
    path('logout/blacklist', BlackListTokenView.as_view(), name='blacklist'),
]