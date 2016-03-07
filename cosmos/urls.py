"""cosmos URL Configuration
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from users.views import SignUpView, LoginView, ProfileView, BaseProfileView
from django.contrib.auth.views import logout

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r'^systems/', include('system.urls')),
]

# user account related views
urlpatterns += [
    url(r'^login$', LoginView.as_view(), name='login'),
    url(r'^logout$',
        logout,
        kwargs={'next_page': 'home'},
        name='logout'),
    url(r'^signup', SignUpView.as_view(), name='signup'),
    url(r'^u/$', BaseProfileView.as_view(), name='base_profile'),
    url(r'^u/(?P<username>[a-zA-Z0-9_]+)$',
        ProfileView.as_view(),
        name='profile')
]

urlpatterns += [
    url(r'^admin/', admin.site.urls),
]
