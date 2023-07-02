from rest_framework import serializers
# from Trackly_Project.trackly.models import Review
from trackly.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review  # the model we're using
        fields = ('id', 'title', 'author', 'content', 'album', 'status')  # specifying the data we want to use
