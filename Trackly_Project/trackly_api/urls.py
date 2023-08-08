from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ReviewList, SingleReview, CreateUserView, BlackListTokenView, CreateAlbumView, CreateArtistView, \
    SingleAlbumView, CreateSongView, TrackListView, CreateReview, UserProfileView, UserView, RetrieveUsersReviews, \
    CommentList, RandomAlbum

app_name = 'trackly_api'

urlpatterns = [
    path('review/<int:pk>/', SingleReview.as_view(), name='reviewCreate'),  # show a single review
    path('reviews/', ReviewList.as_view(), name='listCreate'),  # show all reviews - data in database
    path('review/create/', CreateReview.as_view(), name='createReview'),
    path('register/', CreateUserView.as_view(), name='userCreate'),
    path('logout/blacklist', BlackListTokenView.as_view(), name='blacklist'),
    # path('album/<int:pk>/', AlbumView.as_view(), name='albums'),
    path('album/create/', CreateAlbumView.as_view(), name='albumCreate'),
    path('artist/create/', CreateArtistView.as_view(), name='artistCreate'),
    path('album/<str:spotify_album_id>/', SingleAlbumView.as_view(), name='viewAlbum'),
    path('album/random/', RandomAlbum.as_view(), name='randomAlbum'),
    # path('album/<str:slug>/', SingleAlbumView.as_view(), name='viewAlbum'),
    # path('album/<int:pk>/', SingleAlbumView.as_view(), name='viewAlbum'),
    path('song/create/', CreateSongView.as_view(), name='createSong'),
    path('album/<int:album_id>/songs/', TrackListView.as_view(), name='tracksList'),
    path('profile/<int:pk>/', UserProfileView.as_view(), name='profileView'),
    path('user/<str:username>/', UserView.as_view(), name='userView'),
    path('user/<int:author_id>/reviews/', RetrieveUsersReviews.as_view(), name='userReviews'),
    path('review/<int:pk>/comments/', CommentList.as_view(), name='reviewComments')



]