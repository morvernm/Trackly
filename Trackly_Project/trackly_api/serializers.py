from django.contrib.admin.utils import lookup_field
from django.http import HttpResponse
from rest_framework import serializers, status
# from Trackly_Project.trackly.models import Review
from trackly.models import Review, Album, Artist, Song, Profile, Favourite, Comment
from django.contrib.auth.models import User
from rest_framework.response import Response


# this file supports the serialization and deserialization of model data from
# the Backend to the React front end and vice versa

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

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
            'id', 'spotify_album_id', 'title', 'artist', 'img_url', 'review_count', 'favourited_by', 'disliked_by')

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


class ReviewSerializer(serializers.ModelSerializer):
    album_data = AlbumSerializer(source='album', read_only=True)
    user_data = UserSerializer(source='author', read_only=True)

    class Meta:
        fields = ('id', 'title', 'album', 'author', 'content', 'rating', 'status',
                  'album_data', 'user_data')  # specifying the data we want to use
        model = Review  # the model we're using

    def create(self, validated_data):
        # album_id = validated_data.pop('album')
        # validated_data.pop('album')
        # album = Album.objects.get(id=album_id)

        # username = validated_data.pop('author')
        # validated_data.pop('author')
        # user = User.objects.get()
        # primary_key = user.pk
        # validated_data['author'] = user.pk
        # validated_data['album'] = album

        review_exists = Review.objects.filter(album=validated_data.get('album'), author=validated_data.get('author'))

        if review_exists:
            return Response(status=status.HTTP_409_CONFLICT)

        # review_exists.DoesNotExist:
        if not review_exists:
            album = validated_data.get('album')
            new_review = Review.objects.create(**validated_data)
            return new_review

        # if not review_exists:
        #
        # else:
        #     return


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


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('id', 'spotify_song_id', 'is_playable', 'title', 'url', 'favourited_by', 'album')

    def create(self, validated_data):
        spotify_song_id = validated_data.pop('spotify_song_id')
        title = validated_data.pop('title')
        # is_playable = serializers.BooleanField()
        url = validated_data.pop('url')
        favourited_by = validated_data.pop('favourited_by')
        is_playable = validated_data.pop('is_playable')
        album_slug = validated_data['album']
        validated_data.pop('album')
        album = Album.objects.get(slug=album_slug)
        validated_data['album'] = album
        song_exists = Song.objects.filter(song_id=spotify_song_id).first()

        if not song_exists:
            new_song = Song.objects.create(is_playable=is_playable, title=title, url=url,
                                           spotify_song_id=spotify_song_id, favourited_by=favourited_by, album=album, )
            return new_song

        return song_exists


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'user', 'image', 'bio')





class FavouriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite
        fields = ('user', 'favourite_albums')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'content', 'user', 'review', 'written')
