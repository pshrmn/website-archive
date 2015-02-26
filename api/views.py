from django.http import HttpResponse
from django.views.generic import View, RedirectView

from urllib.parse import quote_plus
import requests
import json

from recipes.models import Recipe

class RestaurantNamesJSONView(View):
    """
    I don't think that this is technically a "real" JSON object, but it is what typeahead wants
    """
    def get(self, *args, **kwargs):
        # runs faster than Recipe.objects.values("restaurants").distinct() by ~1 second/10k queries
        all_recipes = Recipe.objects.all()
        restaurant_names = set([recipe.restaurant for recipe in all_recipes])
        restaurants = map(make_datum, restaurant_names)
        return HttpResponse(json.dumps(restaurants), content_type="application/json")

class RecipeSearchJSONView(View):
    def post(self, *args, **kwargs):
        # q is query, i is ingredients, p is page, but that isn't used yet
        params = {"q": self.request.POST["q"],
            "i": self.request.POST["i"],
            "p": self.request.POST["p"]}
        param_string = serialize_query_params(params)
        # quote_plus escapes query parameters
        url = "http://www.recipepuppy.com/api/?{}".format( param_string )
        response = requests.get(url)
        return HttpResponse(response.text, content_type="application/json")
    
def make_datum(item):
    datum = {}
    datum["value"] = item
    datum["tokens"] = item.split(" ")
    return datum

def serialize_query_params(query_dict):
    """
    given a dict with key-value pairs for a GET request, return in form key1=value+one&key2=value2
    """
    param_string = "&".join(["{}={}".format(key, query_dict[key]) for key in query_dict if query_dict[key] != ""])
    return quote_plus(param_string, safe="/=&" )

