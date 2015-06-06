"""howfar URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""

from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView

from users.views import LoginView, LogoutView, SignUpView
from workouts.views import (AddGoalView, GoalsView, GoalView, AddWorkoutView)

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r'^about$', TemplateView.as_view(template_name='about.html'), name='about'),
    url(r'^add_workout', AddWorkoutView.as_view(), name='add_workout'),
    url(r'^add_goal', AddGoalView.as_view(), name='add_goal'),
    url(r'^goals', GoalsView.as_view(), name='goals'),
    url(r'^goal/(?P<pk>\d+)', GoalView.as_view(), name='goal'),
)

# user account related views
urlpatterns += patterns(
    '',
    url(r'^login', LoginView.as_view(), name='login'),
    url(r'^logout', LogoutView.as_view(), name='logout'),
    url(r'^signup', SignUpView.as_view(), name='signup'),
)

# admin views
urlpatterns += patterns(
    '',
    url(r'^admin/', include(admin.site.urls), name='admin'),
)
