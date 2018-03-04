"""cosmos URL Configuration
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from django.contrib.auth.views import logout
from users.views import SignUpView, LoginView, ProfileView, BaseProfileView
from system.views import PublicPlanetarySystems

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r'^public-systems$', PublicPlanetarySystems.as_view(), name='public_systems'),
    url(r'^u/', include([
        url(r'^$', BaseProfileView.as_view(), name='base_profile'),
        url(r'^(?P<username>[a-zA-Z0-9@\.\+\-_]+)/', include([
            url(r'^$', ProfileView.as_view(), name='profile'),
            url(r'^', include('system.urls'))
        ])),
        ])),
]

urlpatterns += [
    url(r'^login$', LoginView.as_view(), name='login'),
    url(r'^logout$', logout, kwargs={'next_page': 'home'}, name='logout'),
    url(r'^signup', SignUpView.as_view(), name='signup'),
]

urlpatterns += [
    url(r'^admin/', admin.site.urls),
]
