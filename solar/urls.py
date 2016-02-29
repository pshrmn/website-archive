from django.conf.urls import url

from . import views

urlpatterns = [
    url('^$', views.ListSolarSystems.as_view(), name='list_solar_systems'),
    url('^add$', views.AddSolarSystemView.as_view(), name='add_solar_system'),
    url('^n/(?P<pk>[0-9]+)/$', views.SolarSystemView.as_view(), name='solar_system'),
    url('^n/(?P<pk>[0-9]+)/delete$', views.DeleteSolarSystemView.as_view(), name='delete_solar_system'),
    url('^n/(?P<pk>[0-9]+)/update$', views.UpdateSolarSystemView.as_view(), name='update_solar_system'),
]
