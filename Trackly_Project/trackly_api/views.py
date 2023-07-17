from django.contrib.auth import login
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
# from Trackly_Project.trackly.models import Review
# from trackly import models

from .serializers import ReviewSerializer, RegisterUserSerializer
from trackly.models import Review


# read-write endpoints representing a collection of reviews
# get or post
class ReviewList(generics.ListCreateAPIView):
    #specifying what data we want from Review models
    queryset = Review.reviewObject.all()  #getting all published reviews
    serializer_class = ReviewSerializer
    pass


# read or delete endpoints for a single review
# aka get or delete
# need album id and user id?
class SingleReview(generics.RetrieveDestroyAPIView):
    queryset = Review.objects.all()  # getting alll reviews - will allow us to delete drafts too?
    serializer_class = ReviewSerializer
    pass


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

# class UserProfile()