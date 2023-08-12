from django.test import TestCase
from rest_framework import status
from django.urls import reverse
from django.test import Client
import json
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from django.contrib.auth.models import User



import requests

from trackly.models import Album, Artist
# from Trackly_Project.urls import *

# Create your tests here.
client = APIClient()

test_user_credentials = {
    'username': 'test_user',
    'email': 'test_user@test.com',
    'password': 'test12345'
}

# test_album_data = {
#     self.album = Album.objects.create(spotify_album_id='12345', title='test_album', artist=self.artist, img_url='http//testurl.com/', review_count='0', favourited_by='0',)
# }

# user to use for testing authenticated views
# authenticated_user = User.objects.create(username='louise423', password='testpassword')
# Include an appropriate `Authorization:` header on all requests.
# token = Token.objects.get(user__username='louise423')
# # client = APIClient()
# client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

class CreateUserViewTests(TestCase):

    def setUp(self):
        self.valid_password_length = {
            'username': 'testaccount',
            'email': 'testaccount@test.com',
            'password': 'g!0AB5e8'
        }
        self.invalid_password_length = {
            'username': 'testaccount',
            'email': 'testaccount@test.com',
            'password': 'g!0AB5'
        }
        self.no_email_provided = {
            'username': 'testaccount',
            'password': 'g!0AB5e8'
        }
        self.no_username_provided = {
            'email': 'testaccount@test.com',
            'password': 'g!0AB5e8'
        }

    def test_password_length(self):
        response = client.post(
            reverse('trackly_api:userCreate'),
            data=json.dumps(self.invalid_password_length),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_registration(self):
        response = client.post(
            reverse('trackly_api:userCreate'),
            data=json.dumps(self.valid_password_length),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_no_username_provided(self):
        response = client.post(
            reverse('trackly_api:userCreate'),
            data=json.dumps(self.no_username_provided),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class WriteReviewTests(TestCase):

    def setUp(self):
        self.register_user_url = reverse('trackly_api:userCreate')
        self.user_create = self.client.post(self.register_user_url, test_user_credentials) #create the user
        jwt_auth_url = reverse('token_obtain_pair')  # JWT token generation URL
        self.response = self.client.post(jwt_auth_url, { # generate JWT auth tokens for the user
            'username': test_user_credentials.get('username'),
            'password': test_user_credentials.get('password')
        })

        user_data = self.response.json()
        self.user = User.objects.get(username=test_user_credentials.get('username'))
        self.access_token = user_data.get('access')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.artist = Artist.objects.create(spotify_artist_id='12932', name='artistName')
        self.album = Album.objects.create(spotify_album_id='12345', title='test_album', artist=self.artist, img_url='http//testurl.com/', review_count='0', favourited_by='0',)

        # rating value that exceeds 5
        self.invalid_rating = {
            'title': 'amazing album',
            'album' : self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '7',
            'status': 'published',
        }
        # rating value within the range of 1 - 5
        self.valid_review = {
            'title': 'album of the year',
            'album': self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '5',
            'status': 'published',
        }
        self.zero_rating = {
            'title': 'album of the year',
            'album': self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '0',
            'status': 'published',
        }
        self.blank_rating = {
            'title': 'album of the year',
            'album': self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '',
            'status': 'published',

        }
        self.negative_rating = {
            'title': 'album of the year',
            'album': self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '-1',
            'status': 'published',
        }

    def test_invalid_rating(self):
        response = client.post(
            reverse('trackly_api:createReview'),
            data=json.dumps(self.invalid_rating),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_valid_review(self):
        response = client.post(
            reverse('trackly_api:createReview'),
            data=json.dumps(self.valid_review),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_blank_rating(self):
        response = client.post(
            reverse('trackly_api:createReview'),
            data=json.dumps(self.blank_rating),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

   # def test_zero_rating(self):
   #      response = client.post(
   #          reverse('trackly_api:createReview'),
   #          data=json.dumps(self.zero_rating),
   #          content_type='application/json'
   #      )
   #      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


   # def test_negative_rating(self):
   #     response = client.post(
   #         reverse('trackly_api:createReview'),
   #         data=json.dumps(self.negative_rating),
   #         content_type='application/json'
   #     )
   #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# class FavouritesTest(TestCase):
#     def setUp(self):
#         self.album = Album.objects.create(spotify_album_id='12345', title='test_album', artist=self.artist,
#                                           img_url='http//testurl.com/', review_count='0', favourited_by='0', )
#         self.register_user_url = reverse('trackly_api:userCreate')
#         self.user_create = self.client.post(self.register_user_url, test_user_credentials)  # create the user
#
#
#     def test_add_favourite(self):
#         response = client.post(
#             reverse('trackly_api:createFavourite',)
#         )



