from django.conf.urls import *

from .views import *

urlpatterns = patterns(
    '',
    url(r'^$', RecipeList.as_view(), name='recipe_list'),
    url(r'^view/(?P<pk>\d+)', RecipeView.as_view(), name='view_recipe'),
    url(r'^create$', RecipeCreateView.as_view(), name='create_recipe'),
    url(r'^update/(?P<pk>\d+)', RecipeUpdateView.as_view(), name='update_recipe'),
    url(r'^delete/(?P<pk>\d+)', RecipeDeleteView.as_view(), name='delete_recipe'),
    url(r'^search$', RecipeSearchList.as_view(), name='recipe_search_list'),
    url(r'^public$', PublicRecipeList.as_view(), name='public_recipe_list'),
    url(r'^search/', RecipeSearchJSONView.as_view(), name='recipe_api_search')
)
