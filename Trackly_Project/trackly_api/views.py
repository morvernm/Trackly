from django.contrib.auth import login
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.mixins import CreateModelMixin
# from Trackly_Project.trackly.models import Review
# from trackly import models

from .serializers import ReviewSerializer, RegisterUserSerializer, AlbumSerializer, ArtistSerializer
from trackly.models import Review, Album, Artist
from requests import Request, post
import json
from django.utils import timezone
from django.shortcuts import get_object_or_404

# MultipleFieldLookupMixin code is from django rest documentation:
# https://www.django-rest-framework.org/api-guide/generic-views/
class MultipleFieldLookupMixin:
    def get_object(self):
        queryset = self.get_queryset()             # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs.get(field): # Ignore empty fields.
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj

# read-write endpoints representing a collection of reviews
# get or post
class ReviewList(generics.ListCreateAPIView):
    # specifying what data we want from Review models
    queryset = Review.reviewObject.all()  # getting all published reviews
    serializer_class = ReviewSerializer
    pass


# read or delete endpoints for a single review

class SingleReview(generics.RetrieveDestroyAPIView):
    queryset = Review.objects.all()  # getting all reviews
    serializer_class = ReviewSerializer
    pass


# endpoint to create new users
class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # get data from post
        serializer = RegisterUserSerializer(data=request.data)
        # if serialisation data is valid
        if serializer.is_valid(raise_exception=True):
            # create new user
            new_user = serializer.save()
            if new_user is not None:
                return Response(status=status.HTTP_201_CREATED)

        return Response(RegisterUserSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


# to use when users log out
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
    lookup_field = 'slug'
    # pass


# class  AlbumTracksView()

