from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.core.urlresolvers import reverse
from django.views.generic import (View, DetailView, ListView, CreateView,
                                  DeleteView, UpdateView)
from django.contrib.auth.decorators import login_required

from urllib.parse import quote_plus
import requests
import json
from itertools import chain

from .models import Recipe
from .forms import RecipeForm


class LoginRequiredMixin(object):
    @classmethod
    def as_view(cls, **initkwargs):
        view = super(LoginRequiredMixin, cls).as_view(**initkwargs)
        return login_required(view)


class RecipeCreateView(LoginRequiredMixin, CreateView):
    template_name = "recipes/recipe_form.html"
    model = Recipe
    form_class = RecipeForm
    login_url = '/login'

    def form_valid(self, form):
        recipe = form.save(commit=False)
        recipe.owner = self.request.user
        recipe.save()
        return super(RecipeCreateView, self).form_valid(form)

    def get_success_url(self):
        return 'view/{}'.format(self.object.id)


class RecipeUpdateView(LoginRequiredMixin, UpdateView):
    template_name = "recipes/recipe_update.html"
    model = Recipe
    form_class = RecipeForm
    login_url = '/login'

    def get_success_url(self):
        return reverse("recipe_list")

    def get_object(self):
        obj = super(RecipeUpdateView, self).get_object()
        if obj.owner != self.request.user:
            raise Http404
        return obj


class RecipeDeleteView(LoginRequiredMixin, DeleteView):
    template_name = "recipes/recipe_confirm_delete.html"
    model = Recipe
    login_url = '/login'

    def get_success_url(self):
        return reverse("recipe_list")

    def get_object(self):
        recipe = super(RecipeDeleteView, self).get_object()
        if recipe.owner != self.request.user:
            raise Http404
        return recipe


class RecipeView(DetailView):
    template_name = "recipes/view.html"
    model = Recipe

    def get_object(self):
        obj = get_object_or_404(Recipe, pk=self.kwargs.get("pk"))
        if not obj.visible and obj.owner != self.request.user:
            raise Http404
        return obj


class RecipeList(ListView):
    template_name = "recipes/list.html"
    model = Recipe

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return self.request.user.recipe_set.all()
        else:
            return Recipe.objects.filter(visible=True)


class PublicRecipeList(ListView):
    template_name = "recipes/public_list.html"
    model = Recipe

    def get_queryset(self):
        return Recipe.objects.filter(visible=True)


class RecipeSearchList(ListView):
    template_name = "recipes/search.html"
    model = Recipe

    def get_queryset(self):
        """
        basic search, just checks if the phrase appears in the name of a recipe
        """
        search_term = self.request.GET["name"]
        if self.request.user.is_authenticated():
            user_recipes = self.request.user.recipe_set \
                .filter(name__icontains=search_term)
            public_recipes = Recipe.objects \
                .filter(name__icontains=search_term) \
                .filter(visible=True).exclude(owner=self.request.user)
            result_list = list(chain(user_recipes, public_recipes))
            return result_list
        else:
            return Recipe.objects.filter(name__icontains=search_term) \
                .filter(visible=True)


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
