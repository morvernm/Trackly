from django.test import TestCase
from rest_framework import status
from django.urls import reverse
from django.test import Client
import json
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from django.contrib.auth.models import User

import requests

from trackly.models import Album, Artist, Profile, Review

client = APIClient()

test_user_credentials = {
    'username': 'test_user',
    'email': 'test_user@test.com',
    'password': 'test12345'
}

test_artist_data = {
    'spotify_artist_id': '129324',
    'name': 'testArtistName'
}


# user registration tests
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


# Review CRUD tests
class ReviewTests(TestCase):

    def setUp(self):
        self.register_user_url = reverse('trackly_api:userCreate')
        self.user_create = self.client.post(self.register_user_url, test_user_credentials)  # a review author
        jwt_auth_url = reverse('token_obtain_pair')  # JWT token generation URL
        self.response = self.client.post(jwt_auth_url, {  # generate JWT auth tokens for the first test user
            'username': test_user_credentials.get('username'),
            'password': test_user_credentials.get('password')
        })

        user_data = self.response.json()
        self.user = User.objects.get(username=test_user_credentials.get('username'))
        self.access_token = user_data.get('access')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # creating a test artist instance and albums
        self.artist = Artist.objects.create(spotify_artist_id='12932', name='artistName')
        self.album = Album.objects.create(spotify_album_id='12345', title='test_album', artist=self.artist,
                                          img_url='http//testurl.com/', review_count='0', favourited_by='0', )
        self.album_two = Album.objects.create(spotify_album_id='83221', title='test_album_two', artist=self.artist,
                                              img_url='http//testurl.com/', review_count='0', favourited_by='0', )
        self.album_three = Album.objects.create(spotify_album_id='29103', title='test_album_three', artist=self.artist,
                                                img_url='http//testurl.com/', review_count='0', favourited_by='0', )
        self.album_four = Album.objects.create(spotify_album_id='93920', title='test_album_four', artist=self.artist,
                                               img_url='http//testurl.com/', review_count='0', favourited_by='0', )
        self.album_five = Album.objects.create(spotify_album_id='30212', title='test_album_five', artist=self.artist,
                                               img_url='http//testurl.com/', review_count='0', favourited_by='0', )

        self.album_six = Album.objects.create(spotify_album_id='48320', title='test_album_six', artist=self.artist,
                                              img_url='http//testurl.com/', review_count='0', favourited_by='0', )

        self.test_review = Review.objects.create(title='album of the year', album=self.album_two,
                                                 author=self.user, content='amazing album, favourite of the year',
                                                 rating='5', status='published', )

        # test for inputting a rating exceeds the maximum - 5
        self.invalid_rating = {
            'title': 'amazing album',
            'album': self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '7',
            'status': 'published',
        }

        # rating value within the range of 1 - 5 and all required fields
        self.valid_review = {
            'title': 'Amazing album!',
            'album': self.album_five.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '5',
            'status': 'published',
        }

        # editing the review of an existing album: 'test_review' instance in line 109
        self.edited_review = {
            'title': 'Best album of 2023!',
            'album': self.album_two.id,
            'author': self.user.id,
            'content': 'This is my favourite album of 2023. Amazing tracks.',
            'rating': '5',
            'status': 'published',
        }
        # proving a rating outside of min and max range for the rating field
        self.zero_rating = {
            'title': 'album of the year',
            'album': self.album_three.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '0',
            'status': 'published',
        }

        # failing to provide a required field
        self.blank_rating = {
            'title': 'album of the year',
            'album': self.album_six.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '',
            'status': 'published',

        }

        # rating value outside of rating range
        self.negative_rating = {
            'title': 'album of the year',
            'album': self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '-1',
            'status': 'published',
        }

    def test_invalid_rating(self): # trying to post a rating value that exceeds the rating field's range
        response = client.post(
            reverse('trackly_api:createReview'),
            data=json.dumps(self.invalid_rating),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_review(self): #posting a review that has all the required fields
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

    def test_zero_rating(self):
        response = client.post(
            reverse('trackly_api:createReview'),
            data=json.dumps(self.negative_rating),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test for editing an existing review instance
    def test_edit_review(self):
        response = client.put(
            reverse('trackly_api:reviewCreate', args=([self.test_review.pk])),
            data=json.dumps(self.edited_review),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def delete_existing_review(self):
        response = client.delete(
            reverse('trackly_api:reviewCreate', args=([self.test_review.pk])),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def access_deleted_review(self):
        response = client.get(
            reverse('trackly_api:reviewCreate', args=([self.test_review.pk])),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertRaises(self.test_review.DoesNotExist, Review.objects.get(pk=self.test_review.pk))


# class GetReviews(TestCase):
class FavouritesTests(TestCase):
    def setUp(self):
        self.artist = Artist.objects.create(**test_artist_data)

        test_album_data = {
            'spotify_album_id': '12345',
            'title': 'test_album',
            'artist': self.artist,
            'img_url': 'http//testurl.com/',
            'review_count': '0',
            'favourited_by': '0',
        }

        self.album = Album.objects.create(**test_album_data)
        self.register_user_url = reverse('trackly_api:userCreate')
        self.user_create = self.client.post(self.register_user_url, test_user_credentials)  # create the user
        self.user = User.objects.get(username=test_user_credentials.get('username'))
        self.profile = Profile.objects.get(user=self.user)

        self.valid_favourite = {
            'profile': self.profile.pk,
            'album': self.album.pk,
        }
        self.valid_favourite_two = {}

    def test_add_favourite(self):
        response = client.post(
            reverse('trackly_api:createFavourite', args=([self.user.pk, ])),
            data=json.dumps(self.valid_favourite),
            content_type='application/json'

        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def create_duplicate_favourite(self):
        response = client.post(
            reverse('trackly_api:createFavourite', args=([self.user.pk, ])),
            data=json.dumps(self.valid_favourite),
            content_type='application/json'

        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
