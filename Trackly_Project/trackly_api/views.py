from django.contrib.auth import login
from django.db.models import Avg
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import random

from .serializers import ReviewSerializer, RegisterUserSerializer, AlbumSerializer, ArtistSerializer, \
    UserProfileSerializer, UserSerializer, CommentSerializer, FavouriteSerializer

from trackly.models import Review, Album, Artist, Song, Profile, User, Comment, Favourite
import json
from django.utils import timezone
from django.shortcuts import get_object_or_404


# review-related views


# read-write endpoints representing a collection of reviews
class ReviewList(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        album_pk = self.kwargs['album_pk']  # Assuming 'album_pk' is the name of the URL parameter
        queryset = Review.objects.filter(album_id=album_pk)
        return queryset


# read or delete endpoints for a single review

class SingleReview(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()  # getting all reviews
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


# authentication related views

class CreateUserView(APIView):
    permission_classes = [AllowAny]

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


# album and artist views

class CreateAlbumView(generics.CreateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class CreateArtistView(generics.CreateAPIView):
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
            random_album_ids = [random.randint(first_album.pk, last_album.pk) for _ in range(6)]
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
    # queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        review_pk = self.kwargs['review_pk']
        return Comment.objects.filter(review__pk=review_pk)

    pass


class WriteComment(generics.CreateAPIView):
    serializer_class = CommentSerializer
    pass


class FavouriteList(generics.ListCreateAPIView):
    serializer_class = FavouriteSerializer

    def get_queryset(self):
        user_pk = self.kwargs['user_pk']
        queryset = Favourite.objects.filter(profile__user__pk=user_pk)
        return queryset


class AlbumFavouriteList(generics.ListAPIView):
    serializer_class = FavouriteSerializer

    def get_queryset(self):
        album_pk = self.kwargs['album_pk']
        queryset = Favourite.objects.filter(album__pk=album_pk)
