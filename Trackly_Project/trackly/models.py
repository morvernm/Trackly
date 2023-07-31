import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
import random




class Profile(models.Model):
    # links userProfile model to a user model instance
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # user's image can be blank
    image = models.ImageField(upload_to='profile_images', blank=True)
    bio = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return self.user.username


class Artist(models.Model):
    # will get artistId from spotify api and store it here
    spotify_artist_id = models.CharField(max_length=250, null=True)
    name = models.CharField(max_length=250)
    slug = models.SlugField(max_length=100, unique=True,  default=uuid.uuid4)
    # albums = models.ForeignKey('Album', on_delete=models.CASCADE, related_nampye='artist_albums', null=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Artist, self).save(*args, **kwargs)
    def __str__(self):
        return self.name


class Album(models.Model):
    # from spotifyAPI
    spotify_album_id = models.CharField(max_length=250, unique=True)
    title = models.CharField(max_length=250)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='album_artist')
    secondArtist = models.ManyToManyField(Artist, related_name='album_artists')
    img_url = models.URLField()
    # img = models.ImageField()
    # songs = models.ForeignKey('Song', on_delete=models.CASCADE, related_name='album_songs',)
    # reviews = models.ForeignKey('Review', on_delete=models.CASCADE, related_name='album_reviews', blank=True, null=True)
    review_count = models.PositiveIntegerField(default=0, blank=True, null=True)
    # count of the users who have favourited this album
    favourited_by = models.PositiveIntegerField(default=0, blank=True, null=True)
    disliked_by = models.PositiveIntegerField(default=0, blank=True, null=True)
    slug = models.SlugField(max_length=100, unique=True, default=uuid.uuid4)

    def save(self, *args, **kwargs):
        if Album.objects.filter(title=self.title).exists():
            prefix = random.randint(0, 100000)
            self.slug = prefix + slugify(self.title)
        else:
            self.slug = slugify(self.title)
        super(Album, self).save(*args, **kwargs)


    def __str__(self):
        return self.title


class Song(models.Model):
    # spotify songID
    song_id = models.CharField(max_length=250,)
    title = models.CharField(max_length=250,)
    is_playable = models.BooleanField()
    url = models.URLField()
    # number of users who have favourited the song
    favourited_by = models.IntegerField(default=0)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='album_track',)

    def __str__(self):
        return self.title

class Review(models.Model):
    # ReviewObjects code below is modelled off of Very Academy Learn DR video
    class ReviewObjects(models.Manager):
        # filter model by published - only show published reviews
        def get_queryset(self):
            return super().get_queryset().filter(status='published')

    options = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )
    print(type(options))

    title = models.CharField(max_length=250)  # title of review
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')  # author of review
    content = models.TextField()  # review content
    published = models.DateTimeField(default=timezone)  # date and time review was published
    status = models.CharField(max_length=10, choices=options)  # status of review
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    objects = models.Manager()  # default manager returned in queryset
    reviewObject = ReviewObjects()  # review objects - filtered so only returning published posts
    published = models.DateTimeField(default=timezone.now)
    # rating_options = [
    #     ('F', 'Favourite'),
    #     ('D', 'Dislike'),
    #
    # ]
    rating = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])


    # write fields for getting likes, favourites and dislikes
    class Meta:
        ordering = ('-published',)

    def __str__(self):
        return self.title  # return title of review


class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    favourite_songs = models.ManyToManyField(Song)
    favorite_albums = models.ManyToManyField(Album)

    def __str__(self):
        return {self.favourite_songs, self.favorite_albums}


class UserFollowing(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE,  related_name='following')
    following_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')


class Comment(models.Model):
    content = models.CharField(max_length=300)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    written = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.content
