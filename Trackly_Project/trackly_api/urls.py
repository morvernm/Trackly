from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ReviewList, SingleReview, CreateUserView, BlackListTokenView, CreateAlbumView, CreateArtistView, \
    SingleAlbumView, CreateSongView, TrackListView, CreateReview, UserProfileView, UserView, RetrieveUsersReviews, \
    CommentList, RandomAlbums, WriteComment, FavouriteList

app_name = 'trackly_api'

urlpatterns = [
    path('review/<int:pk>/', SingleReview.as_view(), name='reviewCreate'),  # show a single review
    path('albums/<int:album_pk>/reviews/', ReviewList.as_view(), name='listCreate'),  # show all reviews - data in database
    path('review/create/', CreateReview.as_view(), name='createReview'),
    path('register/', CreateUserView.as_view(), name='userCreate'),
    path('logout/blacklist', BlackListTokenView.as_view(), name='blacklist'),
    # path('album/<int:pk>/', AlbumView.as_view(), name='albums'),
    path('album/create/', CreateAlbumView.as_view(), name='albumCreate'),
    path('artist/create/', CreateArtistView.as_view(), name='artistCreate'),
    path('album/<str:spotify_album_id>/', SingleAlbumView.as_view(), name='viewAlbum'),
    path('random-album/', RandomAlbums.as_view(), name='randomAlbum'),
    path('song/create/', CreateSongView.as_view(), name='createSong'),
    path('album/<int:album_id>/songs/', TrackListView.as_view(), name='tracksList'),
    path('profile/user/<int:user>', UserProfileView.as_view(), name='profileView'),
    path('user/<str:username>/', UserView.as_view(), name='userView'),
    path('user/<int:author_id>/reviews/', RetrieveUsersReviews.as_view(), name='userReviews'),
    path('review/<int:pk>/comments/', CommentList.as_view(), name='reviewComments'),
    path('review/<int:pk>/comments/write', WriteComment.as_view(), name='writeComment'),
    path('user/<int:user_pk>/favourites', FavouriteList.as_view(), name='createFavourite')




]