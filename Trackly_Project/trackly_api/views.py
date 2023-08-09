from django.contrib.auth import login
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import random
from rest_framework.mixins import CreateModelMixin
# from Trackly_Project.trackly.models import Review
# from trackly import models
# from credentials import CLIENT_ID, CLIENT_SECRET

from .serializers import ReviewSerializer, RegisterUserSerializer, AlbumSerializer, ArtistSerializer, SongSerializer, \
    UserProfileSerializer, UserSerializer, CommentSerializer, FavouriteSerializer

from trackly.models import Review, Album, Artist, Song, Profile, User, Comment, Favourite
import json
from django.utils import timezone
from django.shortcuts import get_object_or_404


# MultipleFieldLookupMixin code is from django rest documentation:
# https://www.django-rest-framework.org/api-guide/generic-views/
class MultipleFieldLookupMixin:
    def get_object(self):
        queryset = self.get_queryset()  # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs.get(field):  # Ignore empty fields.
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj


# review-related views


# read-write endpoints representing a collection of reviews
class ReviewList(generics.ListCreateAPIView):
    # specifying what data we want from Review models
    # queryset = Review.reviewObject.all()  # getting all published reviews
    serializer_class = ReviewSerializer
    # pass
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
    # permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    pass


class RetrieveUsersReviews(generics.ListCreateAPIView):
    # queryset = Review.objects.filter(author.pk)
    serializer_class = ReviewSerializer

    def get_queryset(self):
        user_pk = self.kwargs['author_id']

        return Review.objects.filter(author_id=user_pk)


# authentication related views

class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # get data from post
        serializer = RegisterUserSerializer(data=request.data)
        # if serialisation data is valid
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
    # permission_classes = ()
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    print(serializer_class)


class CreateArtistView(generics.CreateAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


class SingleAlbumView(generics.RetrieveUpdateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    # lookup_field = ('artist', 'title')
    lookup_field = 'spotify_album_id'
    # lookup_field = 'slug'
    # pass


class CreateSongView(generics.CreateAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer


class TrackListView(generics.ListAPIView):
    serializer_class = SongSerializer

    def get(self, request, album_id, serializer_class=serializer_class):
        album = Album.objects.get(pk=album_id)
        if album:
            tracks = Song.objects.filter(album=album)
            # serializer_class = SongSerializer
            return Response(tracks, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Album not found.'}, status=status.HTTP_404_NOT_FOUND)


class RandomAlbums(generics.ListAPIView):
    serializer_class = AlbumSerializer
    queryset = Album.objects.all()

    def get(self, request):
        try:
            first_album = Album.objects.order_by("id").first()
            last_album = Album.objects.order_by("id").last()
            # random_album_id = random.randint(first_album.pk, last_album.pk)
            random_album_ids = [random.randint(first_album.pk, last_album.pk) for _ in range(6)]
            # try:
            #     random_album = Album.objects.all().filter(pk=random_album_id).first()
            random_albums = Album.objects.filter(pk__in=random_album_ids)
            # queryset = random_album
            serializer = self.serializer_class(random_albums, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"message": "Random album not found"}, status=status.HTTP_404_NOT_FOUND)


# user views

class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    # lookup_field = User.username


class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'


class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    pass


class WriteComment(generics.CreateAPIView):
    serializer_class = CommentSerializer
    pass


class CreateFavourite(generics.CreateAPIView):
    serializer_class = FavouriteSerializer
    pass

class FavouriteList(generics.ListCreateAPIView):
    queryset = Favourite.objects.all()
    serializer_class = FavouriteSerializer
    pass
