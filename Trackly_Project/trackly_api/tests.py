from django.test import TestCase
from rest_framework import status
from django.urls import reverse
from django.test import Client
import json
import requests

# Create your tests here.
client = Client()


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

    def add_album(self):

    def setUp(self):
        self.invalid_rating = {
            'title': 'best album',
            'album' : 'testAlbum',
            'author': 'morvern',
            'content': 'amazing album, favourite of the year',
            'rating': '7',
            'status': 'published',
        }
        self.valid_review = {
            'title': 'album of the year',
            'album': 'testAlbum',
            'author': 'morvern',
            'content': 'amazing album, favourite of the year',
            'rating': '5',
            'status': 'published',
        }


    def test_invalid_rating(self):
        response = client.post(
            reverse('trackly_api:listCreate'),
            data=json.dumps(self.invalid_rating),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    # def test_valid_review(self):
    #     response = client.post(
    #         reverse('trackly_api:listCreate'),
    #         data=json.dumps(self.valid_review),
    #         content_type='application/json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)