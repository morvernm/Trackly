from django.contrib import admin
# from trackly.models import UserProfile
from .models import Review, Album, Artist

admin.site.register(Review)
admin.site.register(Album)
admin.site.register(Artist)

# SignUp your models here.
# admin.site.register(UserProfile)