from rest_framework import serializers
# from Trackly_Project.trackly.models import Review
from trackly.models import Review
from django.contrib.auth.models import User


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'title', 'album', 'author', 'content', 'rating', 'status')  # specifying the data we want to use
        model = Review  # the model we're using


# user registration serializer
class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        # mandatory fields for user registration
        extra_kwargs = {'password': {'write_only': True}}

    def create(self,validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user
        # if password


# userDelete one?
# logout