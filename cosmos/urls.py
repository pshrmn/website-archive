"""cosmos URL Configuration
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from users.views import LoginView, LogoutView, SignUpView

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r'^systems/', include('system.urls')),
]

# user account related views
urlpatterns += [
    url(r'^login', LoginView.as_view(), name='login'),
    url(r'^logout', LogoutView.as_view(), name='logout'),
    url(r'^signup', SignUpView.as_view(), name='signup'),
]

urlpatterns += [
    url(r'^admin/', admin.site.urls),
]
