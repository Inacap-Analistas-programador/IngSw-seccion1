from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import File
from django.urls import reverse


class FileModelAndAPITest(TestCase):
	def setUp(self):
		self.user = get_user_model().objects.create_user('tester', password='pass')
		self.client = Client()

	def test_file_model_create(self):
		f = File.objects.create(filename='a.txt')
		self.assertEqual(str(f), 'a.txt')

	def test_list_requires_authentication(self):
		url = reverse('file-list')
		resp = self.client.get(url)
		# DRF default IsAuthenticated should return 403 or 302 depending on auth setup;
		# ensure non-logged-in can't access list (status code != 200)
		self.assertNotEqual(resp.status_code, 200)

