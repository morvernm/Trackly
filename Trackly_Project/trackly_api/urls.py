from django.urls import path
from .views import ReviewList, SingleReview, CreateUserView

app_name = 'trackly_api'

urlpatterns = [
    path('<int:pk>/', SingleReview.as_view(), name='reviewCreate'),  # show a single review
    path('', ReviewList.as_view(), name='listCreate'),  # show all reviews - data in database
    path('register', CreateUserView.as_view(), name='userCreate'),
    # path('login', LoginView.as_view(), name='userLogin'),
]