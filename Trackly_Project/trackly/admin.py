from django.contrib import admin
# from trackly.models import UserProfile
from .models import Review, Album, Artist, Profile

admin.site.register(Review)
admin.site.register(Album)
admin.site.register(Artist)
admin.site.register(Profile)
# SignUp your models here.
# admin.site.register(UserProfile)