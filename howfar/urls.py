from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView

from users.views import LoginView, LogoutView, SignUpView
from workouts.views import (AddGoalView, GoalsView, GoalView,
                            AddWorkoutView, DeleteWorkoutView)

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r'^about$', TemplateView.as_view(template_name='about.html'), name='about'),
    url(r'^add_goal', AddGoalView.as_view(), name='add_goal'),
    url(r'^goals', GoalsView.as_view(), name='goals'),
    url(r'^goal/(?P<pk>\d+)$', GoalView.as_view(), name='goal'),
    url(r'^goal/(?P<pk>\d+)/add_workout', AddWorkoutView.as_view(), name='add_workout'),
    url(r'^delete_workout/(?P<pk>\d+)', DeleteWorkoutView.as_view(), name='delete_workout'),
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
