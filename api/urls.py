from django.conf.urls import *

from .views import *

urlpatterns = patterns(
    '',
    url(r'^search/', RecipeSearchJSONView.as_view(), name='recipe_api_search'),
)
