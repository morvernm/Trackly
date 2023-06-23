from django.db import models
from django.contrib.auth.models import User
# Create your models here.

# custom userProfile model to add extra attributes to existing User model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    country = models.CharField(max_length=32)
    # user's image can be blank
    image = models.ImageField(upload_to='profile_images', blank=True)
    def __str__(self):
        return self.user.username


