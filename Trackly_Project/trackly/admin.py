from django.contrib import admin
# from trackly.models import UserProfile
from .models import Review, Album, Artist, Profile, Comment, Favourite

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')

    def __str__(self):
        return f"{self.id}: {self.username}"

admin.site.register(Review)
admin.site.register(Album)
admin.site.register(Artist)
admin.site.register(Profile)
admin.site.register(Favourite)
# admin.site.register(UserFollowing)
admin.site.register(Comment)
