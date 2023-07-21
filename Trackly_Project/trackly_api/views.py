from django.contrib.auth import login
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .credentials import *
# from Trackly_Project.trackly.models import Review
# from trackly import models

from .serializers import ReviewSerializer, RegisterUserSerializer
from trackly.models import Review
from requests import Request, post
import json
from django.utils import timezone


# read-write endpoints representing a collection of reviews
# get or post
class ReviewList(generics.ListCreateAPIView):
    # specifying what data we want from Review models
    queryset = Review.reviewObject.all()  # getting all published reviews
    serializer_class = ReviewSerializer
    pass


# read or delete endpoints for a single review
# aka get or delete
# need album id and user id?
class SingleReview(generics.RetrieveDestroyAPIView):
    queryset = Review.objects.all()  # getting alll reviews - will allow us to delete drafts too?
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


# requesting authorisation to then make requests to spotify's api
# class SpotifyAuth(APIView):
#     def get(self, request, format=None):
#             Request('GET', 'https://accounts.spotify.com/authorize', data={
#             'client_id': CLIENT_ID,
#             'response_type': 'code',
#             'redirect_uri': REDIRECT_URI,
#         })
# return Response({}, status=status.HTTP_200_OK)

# requesting spotify access and refresh tokens
# class SpotifyTokens(APIView):
#     access_token = ''
#     refresh_token = ''
#
#     def spotify_token(request, format=None):
#         code = request.GET.get('code')
#         error = request.GET.get('error')
#         response = post('https://accounts.spotify.com/api/token', data={
#             'grant_type': 'authorization_code',
#             'code': code,
#             'redirect_uri': REDIRECT_URI,
#             'client_id': CLIENT_ID,
#             'client_secret': CLIENT_SECRET,
#         })
#         if response.status_code == 200:
#             access_token = response.get('access_token')
#             token_type = response.get('token_type')
#             refresh_token = response.get('refresh_token')
#             expires_in = response.get('expires_in')
#             error = response.get('error')
#             return response.json()
#         else:
#             return Response('token generation failure')
#
#     def get(self, request, format=None, access_token=None, refresh_token=None):
#         self.spotify_token()
#         return Response({'access_token': access_token, 'refresh_token': refresh_token}, status=status.HTTP_200_OK)


# class SpotifyCredentialsView(APIView):
#     permission_classes = [AllowAny]
#
#     def get(self, request, format=None):
#         client_id = CLIENT_ID
#         client_secret = CLIENT_SECRET
#         url = Request('GET', )
#         # serializer = SpotifySerializer(data=request.data)
#         try:
#             return Response({'client_id': client_id, 'client_secret': client_secret}, status=status.HTTP_200_OK)
#         except Exception as error:
#             return Response(status=status.HTTP_404_NOT_FOUND)
#
#
# def refresh_spotify_token():
#     response = post('https://accounts.spotify.com/api/token', data={
#         'grant_type': 'refresh_token',
#         'refresh_token': refresh_token,
#         'client_id': CLIENT_ID,
#         'client_secret': CLIENT_SECRET,
#     }).json()
#     if response.status_code == 200:
#         return response.json()
#     else:
#         return Response(status.HTTP_400_BAD_REQUEST)
#
#     access_token = response.get('access_token')
#     token_type = response.get('token_type')
#     expires_in = response.get('expires_in')
#     refresh_token = response.get('refresh_token')

# class UserProfile()

# class AuthURL(APIView):
#
