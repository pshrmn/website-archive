import json
import urlparse

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model

from recipes.models import Recipe

from api.views import *

User = get_user_model()

class RecipeAPITests(TestCase):

	def setUp(self):
		fake_user, created = User.objects.get_or_create(username="Faker")
		Recipe.objects.get_or_create(
			owner = fake_user,
			name = "Chicken Quesadilla",
			dish_name = "Spicy Chicken Quesadilla",
			restaurant = "Taco Johns",
			visible = False,
			url = "http://www.example.com"
			)
		Recipe.objects.get_or_create(
			owner = fake_user,
			name = "Bacon Cheeseburger",
			dish_name = "Little Bacon Cheeseburger",
			restaurant = "Five Guys",
			visible = False,
			url = "http://example.com"
			)
		Recipe.objects.get_or_create(
			owner = fake_user,
			name = "Pork Taco",
			dish_name = "Pork Taco",
			restaurant = "Taco Johns",
			visible = False,
			url = "http://example.com"
			)

	def test_restaurants_json(self):
		url = reverse('restaurants_json')
		response = self.client.get(url)
		self.assertEquals(response.status_code, 200)
		data = json.loads(response.content)
		self.assertEquals(len(data), 2)

	def test_serialize_query_parameters(self):
		params = {
			"x": 15,
			"y": "this is a string"
		}
		serialized = serialize_query_params(params)
		serialized_qs = urlparse.parse_qs(serialized)
		expected_qs = urlparse.parse_qs("x=15&y=this+is+a+string")
		self.assertEqual(serialized_qs, expected_qs)