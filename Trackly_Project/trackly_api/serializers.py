from django.contrib.admin.utils import lookup_field
from django.http import HttpResponse
from rest_framework import serializers, status
# from Trackly_Project.trackly.models import Review
from trackly.models import Review, Album, Artist, Profile, Favourite, Comment, UserFollowing
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.db.models import F


# this file supports the serialization and deserialization of model data from
# the Backend to the React front end and vice versa

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Your password must be at least 8 characters long.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value):
            raise serializers.ValidationError("Username already registered")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class AlbumSerializer(serializers.ModelSerializer):
    artist = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Artist.objects.all(),
        # lookup_field='slug',
    )


    class Meta:
        model = Album
        fields = (
            'id', 'spotify_album_id', 'title', 'artist', 'img_url', 'review_count', 'favourited_by',)

    def create(self, validated_data):
        artist_slug = validated_data['artist']
        validated_data.pop('artist')
        artist = Artist.objects.get(name=artist_slug)
        validated_data['artist'] = artist

        album_exists = Album.objects.filter(spotify_album_id=validated_data['spotify_album_id']).exists()

        artist_exists = Artist.objects.filter(slug=artist_slug).first()

        if not album_exists:
            new_album = Album.objects.create(**validated_data)
            return new_album

        return album_exists


class ReviewSerializer(serializers.ModelSerializer):
    album_data = AlbumSerializer(source='album', read_only=True)
    user_data = UserSerializer(source='author', read_only=True)

    class Meta:
        fields = ('id', 'title', 'album', 'author', 'content', 'rating', 'status',
                  'album_data', 'user_data')
        model = Review

    def create(self, validated_data):
        review_exists = Review.objects.filter(album=validated_data.get('album'), author=validated_data.get('author'))
        if review_exists:
            error_message = ({'album': 'You have already reviewed this album'})
            return error_message

        new_review = Review.objects.create(**validated_data)
        return new_review


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ('spotify_artist_id', 'name',)

    # overriding create to check if album exists in database already
    def create(self, validated_data):
        spotify_artist_id = validated_data.pop('spotify_artist_id')
        name = validated_data.pop('name')
        artist_exists = Artist.objects.filter(spotify_artist_id=spotify_artist_id).first()

        if not artist_exists:
            new_artist = Artist.objects.create(spotify_artist_id=spotify_artist_id, name=name)
            return new_artist

        return artist_exists


class UserProfileSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'user_data', 'image', 'bio',)


class FavouriteSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='author', read_only=True)
    album_data = AlbumSerializer(source='album', read_only=True)

    class Meta:
        model = Favourite
        fields = ('id', 'profile', 'album', 'album_data', 'user_data',)

    def create(self, validated_data):
        album = validated_data.get('album')
        user_profile = validated_data.get('profile')
        favourite_exists = Favourite.objects.filter(profile=user_profile, album=album)
        print(favourite_exists)

        if favourite_exists:
            raise serializers.ValidationError("Album is already favourited")
        elif not favourite_exists:
            new_favourite = Favourite.objects.create(**validated_data)
            # print(f'Before increment: favourited_by = {album.favourited_by}')
            album.favourited_by += 1
            album.save()
            return new_favourite


class CommentSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    written = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")

    class Meta:
        model = Comment
        fields = ('id', 'content', 'user', 'review', 'written', 'user_data',)


# class FollowSerializer(serializers.ModelSerializer):
#     following_data = UserSerializer(source='following_user_id', read_only=True)
#
#     class Meta:
#         model = UserFollowing
#         fields = ('user', 'following_user_id', 'following_data')

