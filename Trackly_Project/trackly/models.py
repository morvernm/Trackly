import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
import random


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    slug = models.SlugField(max_length=100, unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.user.username)
        super(Profile, self).save(*args, **kwargs)

    # A signal to create a Profile when a new user is created.
    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance=None, created=False, **kwargs):
        if created:
            Profile.objects.get_or_create(user=instance)

    def __str__(self):
        return self.user.username


class Artist(models.Model):
    spotify_artist_id = models.CharField(max_length=250, null=True)
    name = models.CharField(max_length=250)
    slug = models.SlugField(max_length=100, unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Artist, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Album(models.Model):
    spotify_album_id = models.CharField(max_length=250, unique=True)
    title = models.CharField(max_length=250)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='album_artist')
    img_url = models.URLField()
    review_count = models.PositiveIntegerField(default=0, blank=True, null=True)
    favourited_by = models.PositiveIntegerField(default=0, blank=True, null=True)
    slug = models.SlugField(max_length=100, unique=True, default=uuid.uuid4)

    def save(self, *args, **kwargs):
        if not self.slug:
            if Album.objects.filter(title=self.title).exists():
                prefix = random.randint(0, 100000)  # generating a unique slug if the album name already exists
                self.slug = prefix + slugify(self.title)
            else:
                self.slug = slugify(self.title)
        super(Album, self).save(*args, **kwargs)

    def __str__(self):
        return self.title


class Review(models.Model):
    class ReviewObjects(models.Manager):
        # filter model by published - only show published reviews. For future work.
        def get_queryset(self):
            return super().get_queryset().filter(status='published')

    options = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )

    title = models.CharField(max_length=250)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author')
    content = models.TextField()
    published = models.DateTimeField(default=timezone)
    status = models.CharField(max_length=10, choices=options)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='reviews')
    objects = models.Manager()  # default manager returned in queryset
    reviewObject = ReviewObjects()  # review objects - filtered so only returning published posts
    published = models.DateTimeField(default=timezone.now)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])

    class Meta:
        ordering = ('-published',)
        unique_together = ('album', 'author',)

    def __str__(self):
        return self.title


class Favourite(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='favourited_album')

    class Meta:
        unique_together = ('profile', 'album',)

    def __str__(self):
        return str(self.album)


class UserFollowing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')

    class Meta:
        unique_together = ('user', 'following_user_id')

    def __str__(self):
        return str(self.user)


class Comment(models.Model):
    content = models.CharField(max_length=300)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    written = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.content
