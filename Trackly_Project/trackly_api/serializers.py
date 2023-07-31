from django.contrib.admin.utils import lookup_field
from rest_framework import serializers
# from Trackly_Project.trackly.models import Review
from trackly.models import Review, Album, Artist
from django.contrib.auth.models import User


# from Trackly_Project.trackly.models import Album


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('title', 'album', 'author', 'content', 'rating', 'status')  # specifying the data we want to use
        model = Review  # the model we're using


# user registration serializer
class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        # mandatory fields for user registration
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Your password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        # if password is not None and len(password) >= 8:
        user.set_password(password)
        # if len(password) >= 8:
        #     user.set_password(password)
        user.save()
        return user
        # if password


class AlbumSerializer(serializers.ModelSerializer):
    artist = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Artist.objects.all(),
        # lookup_field='slug',
    )
    class Meta:
        model = Album
        fields = ('spotify_album_id', 'title', 'artist', 'img_url', 'review_count', 'favourited_by', 'disliked_by')

    def create(self, validated_data):
        # artist_id = validated_data.pop('artist')['spotify_artist_id']
        # spotify_artist_id = validated_data.pop('artist')['spotify_artist_id']
        artist_slug = validated_data['artist']
        validated_data.pop('artist')
        artist = Artist.objects.get(name=artist_slug)
        validated_data['artist'] = artist


        # album_exists = Album.objects.filter(spotify_album_id=validated_data['spotify_album_id']).first()
        album_exists = Album.objects.filter(spotify_album_id=validated_data['spotify_album_id']).exists()

        artist_exists = Artist.objects.filter(slug=artist_slug).first()

        # if album_exists and artist_slug is not artist_slug:
        #     album.artists.add(artist_slug)

        if not album_exists:
            # artist = Artist.objects.get(spotify_artist_id=artist_id)
            # new_album = Album.objects.create(album_data['spotify_album_id'], album_data['title'], album_data['artist'], album_data['img_url'], album_data['review_count'], album_data['favourited_by'])
            # new_album = Album.objects.create(artist, **album_data)
            # if artist_slug
            new_album = Album.objects.create(**validated_data)
            return new_album
        # elif album_exists:
        #     return album_exists
        # elif not album_exists and not artist_exists:
        #     new_artist = Artist.objects.create(name=artist_slug)
        #     new_album = Album.objects.create(**validated_data)
        #     return new_album

        return album_exists


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


