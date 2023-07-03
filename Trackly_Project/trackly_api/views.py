from rest_framework import generics  # importing generic API views from rest framework
# from Trackly_Project.trackly.models import Review
# from trackly import models

from .serializers import ReviewSerializer
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
class SingleReview(generics.DestroyAPIView):
    queryset = Review.objects.all()  # getting alll reviews - will allow us to delete drafts too?
    serializer_class = ReviewSerializer
    pass