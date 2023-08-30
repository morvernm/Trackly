from django.test import TestCase
from rest_framework import status
from django.urls import reverse
import json
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .serializers import ReviewSerializer
from rest_framework.exceptions import ValidationError
from django.db import models
from django.utils import timezone
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from trackly.models import Album, Artist, Profile, Review, Favourite, Comment

client = APIClient()

test_user_credentials = {
    'username': 'test_user',
    'email': 'testuser@test.com',
    'password': 'test12345'
}

test_user_two_credentials = {
    'username': 'test_user_two',
    'email': 'testuser2@test.com',
    'password': 'testing12394'

}
test_artist_data = {
    'spotify_artist_id': '129324',
    'name': 'testArtistName'
}

test_user_three_credentials = {
    'username': 'test_user_two',
    'email': 'testuser2@test.com',
    'password': 'test'

}


register_user_url = reverse('trackly_api:userCreate')

jwt_auth_url = reverse('token_obtain_pair')


# user registration tests
class CreateUserViewTests(TestCase):

    def setUp(self):
        self.valid_password_length = {
            'username': 'testaccount',
            'email': 'testaccount@test.com',
            'password': 'g!0AB5e8'
        }
        self.invalid_password_length = {
            'username': 'testaccount2',
            'email': 'testaccount@test.com',
            'password': 'g!0AB5'
        }
        self.no_username_provided = {
            'email': 'testaccount@test.com',
            'password': 'g!0AB5e8'
        }

    def test_password_length(self):
        response = client.post(register_user_url, test_user_three_credentials)
        error_message = {
            'password': ['Your password must be at least 8 characters long.']
        }
        self.assertEqual(response.data, error_message)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_valid_registration(self):
        response = client.post(register_user_url, test_user_two_credentials)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = client.post(register_user_url, test_user_two_credentials)  # try to register the same username again
        serializer_error = 'username'
        self.assertIn(
            serializer_error, response.data
        )

    def test_no_username_provided(self):
        response = client.post(
            reverse('trackly_api:userCreate'),
            data=json.dumps(self.no_username_provided),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class BlacklistTokenViewTests(TestCase):
    def setUp(self):
        self.user = self.client.post(register_user_url, test_user_two_credentials)
        self.user_jwt_response = self.client.post(jwt_auth_url, {  # generate JWT auth tokens for the first test user
            'username': test_user_two_credentials.get('username'),
            'password': test_user_two_credentials.get('password')
        })
        self.user_refresh_token = self.user_jwt_response.json().get('refresh')

    def test_blacklist_token_successful(self):
        blacklist_response = self.client.post(
            reverse('trackly_api:blacklist'),
            data=json.dumps({'refresh_token': self.user_refresh_token}),
            content_type='application/json'
        )
        self.assertEquals(blacklist_response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_blacklist_no_access_token_provided(self):
        blacklist_response = self.client.post(
            reverse('trackly_api:blacklist'),
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEquals(blacklist_response.status_code, status.HTTP_400_BAD_REQUEST)


# Review CRUD tests
class ReviewTests(TestCase):

    def setUp(self):
        self.user_create = self.client.post(register_user_url, test_user_credentials)  # a review author
        self.response = self.client.post(jwt_auth_url, {  # generate JWT auth tokens for the first test user
            'username': test_user_credentials.get('username'),
            'password': test_user_credentials.get('password')
        })

        user_data = self.response.json()
        self.user = User.objects.get(username=test_user_credentials.get('username'))
        self.access_token = user_data.get('access')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # creating a test artist instances and albums
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

        # test data for inputting a rating exceeds the maximum - 5
        self.invalid_rating = {
            'title': 'amazing album',
            'album': self.album.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '7',
            'status': 'published',
        }

        # test data where the rating value is within the range of 1 - 5 and all required fields are provided
        self.valid_review = {
            'title': 'Amazing album!',
            'album': self.album_five.id,
            'author': self.user.id,
            'content': 'amazing album, favourite of the year',
            'rating': '5',
            'status': 'published',
        }

        # test data for editing the review -'test_review' from line 109
        self.edited_review = {
            'title': 'Best album of 2023!',
            'album': self.album_two.id,
            'author': self.user.id,
            'content': 'This is my favourite album of 2023. Amazing tracks.',
            'rating': '5',
            'status': 'published',
        }
        # test data for proving a rating outside of min and max range
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

    def test_invalid_rating(self):  # trying to post a rating value that exceeds the rating field's range
        response = client.post(
            reverse('trackly_api:createReview'),
            data=json.dumps(self.invalid_rating),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_review(self):  # posting a review that has all the required fields
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
        serializer = ReviewSerializer(data=self.negative_rating)
        review_is_valid = serializer.is_valid()
        self.assertFalse(review_is_valid)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # with self.assertRaises(self, ValidationError)

    # Test for editing an existing review instance
    def test_edit_review(self):
        response = client.put(
            reverse('trackly_api:reviewCreate', args=([self.test_review.pk])),
            data=json.dumps(self.edited_review),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_existing_review(self):
        response = client.delete(
            reverse('trackly_api:reviewCreate', args=([self.test_review.pk])),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Review.DoesNotExist):
            Review.objects.get(id=self.test_review.pk)

    def test_get_user_reviews(self):
        response = client.get(
            reverse('trackly_api:userReviews', kwargs={'author_id': self.user.id}),
            content_type='application/json'
        )
        self.assertEqual(len(response.data), 1)  # The user has only reviewed one album
        self.assertTrue(any(review['id'] == self.test_review.id for review in
                            response.data))  # checking that test_album_two is in the user's favourite

    # Test getting all the reviews for an album that has reviews associated with it
    def test_get_album_reviews_exist(self):
        response = client.get(
            reverse('trackly_api:listCreate', kwargs={'album_pk': self.album_two.pk}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(any(review['id'] == self.test_review.id for review in response.data))

    # testing an album that hasn't been reviewed yet: album_three
    def test_get_album_reviews_do_not_exist(self):
        response = client.get(
            reverse('trackly_api:listCreate', kwargs={'album_pk': self.album_three.pk}),
            content_type='application/json'
        )
        self.assertEqual(len(response.data), 0)
        self.assertFalse(any(review['album'] == self.album_three_pk for review in response.data))  # No reviews exist


class FavouritesTests(TestCase):
    def setUp(self):
        self.user_create = self.client.post(register_user_url, test_user_credentials)
        self.response = self.client.post(jwt_auth_url, {  # generate JWT auth tokens for the first test user
            'username': test_user_credentials.get('username'),
            'password': test_user_credentials.get('password')
        })

        user_data = self.response.json()
        self.user = User.objects.get(username=test_user_credentials.get('username'))
        self.access_token = user_data.get('access')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        user_creation_no_token = self.client.post(register_user_url, test_user_two_credentials)
        self.unauthorised_user = User.objects.get(username=test_user_two_credentials.get('username'))

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

        self.profile = Profile.objects.get(user=self.user)

        self.valid_favourite = {
            'profile': self.profile.pk,
            'album': self.album.pk,
        }
        self.valid_favourite_two = {
            'profile': self.profile.pk,
            'album': self.album.pk,
        }

    def test_create_favourite(self):
        self.assertEqual(self.album.favourited_by, '0')  # Album hasn't been favourited yet
        response = client.post(
            reverse('trackly_api:createFavourite', args=([self.user.pk, ])),
            data=json.dumps(self.valid_favourite),
            content_type='application/json'

        )
        updated_album_id = response.json().get('album')
        updated_album = Album.objects.get(
            id=updated_album_id)  # the album's favourite_count fields should change after favourite creation
        favourite_count = updated_album.favourited_by
        self.assertEqual(favourite_count, 1)  # checking if the favourite_count has been updated
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = client.post(  # trying to add the same album to favourites again
            reverse('trackly_api:createFavourite', args=([self.user.pk, ])),
            data=json.dumps(self.valid_favourite),
            content_type='application/json'

        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_favourite(self):
        create_favourite_response = client.post(
            reverse('trackly_api:createFavourite', args=([self.user.pk, ])),
            data=json.dumps(self.valid_favourite),
            content_type='application/json'

        )
        updated_album_id = create_favourite_response.json().get('album')
        updated_album = Album.objects.get(
            id=updated_album_id)  # the album's favourite_count fields should change after favourite creation
        favourite_count = updated_album.favourited_by
        self.assertEqual(favourite_count,
                         1)  # checking if the favourite_count has been updated so we can compare it later

        favourite_id = create_favourite_response.json().get('id')
        delete_response = client.delete(
            reverse('trackly_api:deleteFavourite', args=([favourite_id])),
            content_type='application/json'
        )

        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Favourite.DoesNotExist):
            Favourite.objects.get(id=favourite_id)
        updated_album_after_delete = Album.objects.get(id=updated_album_id)
        updated_favourite_count = updated_album_after_delete.favourited_by
        self.assertEqual(updated_favourite_count, 0)

    def test_get_user_favourites(self):
        create_favourite_response = client.post(
            reverse('trackly_api:createFavourite', args=([self.user.pk, ])),
            data=json.dumps(self.valid_favourite),
            content_type='application/json'

        )
        album_id = create_favourite_response.data['album']
        self.assertEqual(create_favourite_response.status_code, status.HTTP_201_CREATED)
        response = client.get(
            reverse('trackly_api:createFavourite', args=([self.user.pk])),
            content_type='application/json'
        )
        self.assertTrue(any(favourite['album'] == album_id for favourite in response.data))

    def test_get_all_album_favourites(self):
        create_favourite_response = client.post(
            reverse('trackly_api:createFavourite', args=([self.user.pk, ])),
            data=json.dumps(self.valid_favourite),
            content_type='application/json'

        )
        response = client.get(
            reverse('trackly_api:AllFavourites', kwargs={'album_pk': self.album.id}),
            content_type='application/json'
        )
        self.assertTrue(
            any(favourite['album'] == create_favourite_response.data['album'] for favourite in response.data))


class CommentTests(TestCase):
    def setUp(self):
        self.user_create = self.client.post(register_user_url, test_user_credentials)
        self.response = self.client.post(jwt_auth_url, {  # generate JWT auth tokens
            'username': test_user_credentials.get('username'),
            'password': test_user_credentials.get('password')
        })

        self.user_data = self.response.json()
        self.user = User.objects.get(username=test_user_credentials.get('username'))
        self.access_token = self.user_data.get('access')
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.artist = Artist.objects.create(spotify_artist_id='12932', name='artistName')

        self.album = Album.objects.create(spotify_album_id='83221', title='test_album_two', artist=self.artist,
                                          img_url='http//testurl.com/', review_count='0', favourited_by='0')

        self.review = Review.objects.create(title='album of the year', album=self.album,
                                            author=self.user, content='amazing album, favourite of the year',
                                            rating='5', status='published', )

        self.valid_comment = {
            'content': 'I have to disagree, I personally prefer this album over their older albums',
            'user': self.user.pk,
            'review': self.review.pk,
            'written': timezone.now().isoformat()
        }
        self.no_content_comment = {
            'content': '',
            'user': self.user.pk,
            'review': self.review.pk,
            'written': timezone.now().isoformat()
        }

        self.comment_no_user = {
            'content': 'love this album too!',
            'review': self.review.pk,
            'written': timezone.now().isoformat()
        }

        self.comment = Comment.objects.create(
            content='I have to disagree, I personally prefer this album over their older albums', user=self.user,
            review=self.review, written=timezone.now().isoformat())

        self.review_comment_url = reverse('trackly_api:reviewComments', args=([self.review.id]))
        self.comment_url_with_token = f"{self.review_comment_url}?access_token={self.access_token}"

    def test_write_valid_comment(self):
        response = client.post(
            self.comment_url_with_token, args=([self.access_token]),
            data=json.dumps(self.valid_comment),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_reviews_comment(self):
        response = client.get(
            reverse('trackly_api:reviewComments', kwargs={'review_pk': self.review.pk}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_write_comment_no_content(self):
        response = client.post(
            self.comment_url_with_token, args=([self.access_token]),
            data=json.dumps(self.no_content_comment),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_comment(self):
        response = client.delete(
            reverse('trackly_api:deleteComment', args=([self.review.id])),
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class CreateAlbumViewTests(TestCase):
    def setUp(self):
        self.artist = Artist.objects.create(spotify_artist_id='23456', name='testArtist')
        self.album_data = {
            'spotify_album_id': 'abcdefg',
            'title': 'test_album_two',
            'artist': self.artist,
            'img_url': 'https://www.google.co.uk/',
            'review_count': '0',
            'favourite_count': '0',
        }

