from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class UserAccountTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.profile_url = reverse('user_profile')
        self.user_data = {
            "username": "koushik3420",
            "password": "koushik2000",
            "first_name": "koushik",
            "last_name": "ram",
            "dob": "2000-04-03",
            "gender": "Male",
            "email": "koushikram3420@gmail.com"
        }

    def test_register_user(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('username' in response.data)
        self.assertTrue('email' in response.data)
        # Add assertions for other fields as needed

    def test_valid_login_user(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('refresh' in response.data)
        self.assertTrue('access' in response.data)

    def test_invalid_login_user(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
        self.assertEqual(response.data['non_field_errors'][0], 'Invalid username or password')

    def test_user_profile(self):
        # Register and login a user
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['access']
        
        # Access profile with valid token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])
        # Add assertions for other profile data as needed
