from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ReviewList, SingleReview, CreateUserView, BlackListTokenView, CreateAlbumView, CreateArtistView, \
    SingleAlbumView, CreateReview, UserProfileView, UserView, RetrieveUsersReviews, \
    CommentList, RandomAlbums, FavouriteList, AlbumFavouriteList, DeleteFavourite, RecentReviewsAPIView

app_name = 'trackly_api'

urlpatterns = [
    path('review/<int:pk>/', SingleReview.as_view(), name='reviewCreate'),                  # show a single review
    path('albums/<int:album_pk>/reviews/', ReviewList.as_view(), name='listCreate'),        # show all reviews for an album
    path('review/create/', CreateReview.as_view(), name='createReview'),                    # write a review endpoint
    path('register/', CreateUserView.as_view(), name='userCreate'),
    path('logout/blacklist', BlackListTokenView.as_view(), name='blacklist'),
    path('album/create/', CreateAlbumView.as_view(), name='albumCreate'),                   # endpoint to create new albums in the database
    path('artist/create/', CreateArtistView.as_view(), name='artistCreate'),
    path('album/<str:spotify_album_id>/', SingleAlbumView.as_view(), name='viewAlbum'),     # View for a  specific album
    path('random-album/', RandomAlbums.as_view(), name='randomAlbum'),
    path('profile/user/<int:user>', UserProfileView.as_view(), name='profileView'),          # user profile view
    path('user/<str:username>/', UserView.as_view(), name='userView'),
    path('user/<int:author_id>/reviews/', RetrieveUsersReviews.as_view(), name='userReviews'),
    path('review/<int:review_pk>/comments', CommentList.as_view(), name='reviewComments'),
    path('user/<int:user_pk>/favourites', FavouriteList.as_view(), name='createFavourite'),
    path('album/<int:album_pk>/favourites', AlbumFavouriteList.as_view(), name='AllFavourites'),
    path('favourite/<int:pk>', DeleteFavourite.as_view(), name='deleteFavourite'),
    path('recent-reviews', RecentReviewsAPIView.as_view(), name='recentReviews'),
]
