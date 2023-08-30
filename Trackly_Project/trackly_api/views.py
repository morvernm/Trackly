from django.db.models import Subquery, Max
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import random

from .serializers import ReviewSerializer, RegisterUserSerializer, AlbumSerializer, ArtistSerializer, \
    UserProfileSerializer, UserSerializer, CommentSerializer, FavouriteSerializer

from trackly.models import Review, Album, Artist, Profile, User, Comment, Favourite


# review-related views

# read-write endpoints representing a collection of reviews for an album
class ReviewList(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        album_pk = self.kwargs['album_pk']  # to filter reviews by album
        queryset = Review.objects.filter(album_id=album_pk)
        return queryset


# Create/Read/Delete endpoints for reviews

class SingleReview(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    pass


class CreateReview(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_review = serializer.save()
            if new_review is not None:
                return Response(status=status.HTTP_201_CREATED)
        return Response(ReviewSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveUsersReviews(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        user_pk = self.kwargs['author_id']

        return Review.objects.filter(author_id=user_pk)


# Authentication related views

class CreateUserView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_user = serializer.save()
            if new_user is not None:
                return Response(status=status.HTTP_201_CREATED)

        return Response(RegisterUserSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlackListTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as error:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Album and artist views

class CreateAlbumView(generics.CreateAPIView):
    authentication_classes = []
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class CreateArtistView(generics.CreateAPIView):
    authentication_classes = []
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


class SingleAlbumView(generics.RetrieveUpdateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    lookup_field = 'spotify_album_id'


class RandomAlbums(generics.ListAPIView):
    serializer_class = AlbumSerializer
    queryset = Album.objects.all()

    def get(self, request):
        try:
            first_album = Album.objects.order_by("id").first()
            last_album = Album.objects.order_by("id").last()
            random_album_ids = [random.randint(first_album.pk, last_album.pk) for _ in range(3)]
            random_albums = Album.objects.filter(pk__in=random_album_ids)
            serializer = self.serializer_class(random_albums, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"message": "Random album not found"}, status=status.HTTP_404_NOT_FOUND)


# user views

class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'user'


# To provide the username and id of the user
class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'


class CommentList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    # queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        review_pk = self.kwargs['review_pk']
        return Comment.objects.filter(review__pk=review_pk)

    pass


class DeleteCommentView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# Endpoint for a user's favourites
class FavouriteList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FavouriteSerializer

    def get_queryset(self):
        user_pk = self.kwargs['user_pk']
        queryset = Favourite.objects.filter(profile__user__pk=user_pk)
        return queryset


# All the favourites for an album
class AlbumFavouriteList(generics.ListAPIView):
    serializer_class = FavouriteSerializer

    def get_queryset(self):
        album_pk = self.kwargs['album_pk']
        queryset = Favourite.objects.filter(album__pk=album_pk)
        return queryset


class DeleteFavourite(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FavouriteSerializer
    queryset = Favourite.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        album = instance.album
        album.favourited_by -= 1
        album.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RecentReviewsAPIView(APIView):
    def get(self, request, format=None):
        query = Review.objects.values('album').annotate(
            max_published=Max('published'))  # getting albums based on max published time/date
        recent_reviews = Review.objects.filter(
            published__in=Subquery(query.values('max_published'))
        ).order_by('-published')[:7]  # filtering reviews by the 7 most recently published
        serializer = ReviewSerializer(recent_reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
