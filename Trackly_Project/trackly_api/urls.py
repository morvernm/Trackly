from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ReviewList, SingleReview, CreateUserView, BlackListTokenView, CreateAlbumView, CreateArtistView, \
    SingleAlbumView

app_name = 'trackly_api'

urlpatterns = [
    path('review/<int:pk>/', SingleReview.as_view(), name='reviewCreate'),  # show a single review
    path('review/', ReviewList.as_view(), name='listCreate'),  # show all reviews - data in database
    path('register/', CreateUserView.as_view(), name='userCreate'),
    path('logout/blacklist', BlackListTokenView.as_view(), name='blacklist'),
    # path('album/<int:pk>/', AlbumView.as_view(), name='albums'),
    path('album/create/', CreateAlbumView.as_view(), name='albumCreate'),
    path('artist/create/', CreateArtistView.as_view(), name='artistCreate'),
    path('album/<str:slug>/', SingleAlbumView.as_view(), name='viewAlbum'),

]