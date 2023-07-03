from datetime import timezone

from django.db import models
from django.contrib.auth.models import User


# custom userProfile model to add extra attributes to existing User model
# class UserProfile(models.Model):
#     # links userProfile model to a user model instance
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#
#     country = models.CharField(max_length=32)
#     # user's image can be blank
#     image = models.ImageField(upload_to='profile_images', blank=True)

# def __str__(self):
#     return self.user.username

class Artist(models.Model):
    name = models.CharField(max_length=250)

    # songs =
    # albums
    def __str__(self):
        return self.name


class Album(models.Model):
    title = models.CharField(max_length=250)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    # tracklist =
    # reviews = models.ManyToManyField('Review', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Song(models.Model):
    title = models.CharField(max_length=250)
    # artist = models.

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
    title = models.CharField(max_length=250)  # title of review
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')  # author of review
    content = models.TextField()  # review content
    published = models.DateTimeField(default=timezone)  # date and time review was published
    status = models.CharField(max_length=10, choices=options, default='published')  # status of review
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    objects = models.Manager() # default manager returned in queryset
    reviewObject = ReviewObjects() # review objects - filtered so only returning published posts

    rating_options = [
        ('L', 'Like'),
        ('D', 'Dislike'),
        ('F', 'Favourite'),
    ]
    rating = models.CharField(max_length=12, choices=rating_options, default='L')
    # write fields for getting likes, favourites and dislikes
    class Meta:
        ordering = ('-published',)

    def __str__(self):
        return self.title  # return title of review

# class Favourite


# class Concert
