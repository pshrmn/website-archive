from django.http import HttpResponse
from django.views.generic import View

from urllib.parse import quote_plus
import requests
import json


class RecipeSearchJSONView(View):
    def post(self, *args, **kwargs):
        params = json.loads(self.request.body.decode("utf-8"))
        # q is query, i is ingredients, p is page, but I don't use that
        params["p"] = 1
        param_string = serialize_query_params(params)
        # quote_plus escapes query parameters
        url = "http://www.recipepuppy.com/api/?{}".format(param_string)
        response = requests.get(url)
        if not response.ok:
            return HttpResponse("", content_type="application/json")
        return HttpResponse(response.text, content_type="application/json")


def serialize_query_params(qd):
    """
    given a dict with key-value pairs for a GET request, return in
    form key1=value+one&key2=value2
    """
    params = ["{}={}".format(key, qd[key]) for key in qd if qd[key] != ""]
    param_string = "&".join(params)
    return quote_plus(param_string, safe="/=&")
