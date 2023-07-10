from rest_framework import serializers
# from Trackly_Project.trackly.models import Review
from trackly.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'title', 'album', 'author', 'content', 'rating', 'status')  # specifying the data we want to use
        model = Review  # the model we're using