from django.contrib import admin
# from trackly.models import UserProfile
from .models import Review, Album, Artist, Profile, Song, Comment, UserFollowing, Favourite

admin.site.register(Review)
admin.site.register(Album)
admin.site.register(Artist)
admin.site.register(Profile)
admin.site.register(Favourite)
admin.site.register(UserFollowing)
admin.site.register(Comment)
admin.site.register(Song)
# SignUp your models here.
# admin.site.register(UserProfile)