from django.conf.urls import url

from . import views

urlpatterns = [
    url('^$', views.ListSolarSystems.as_view(), name='list_solar_systems'),
    url('^add$', views.AddSolarSystemView.as_view(), name='add_solar_system'),

    url('^n/(?P<pk>[0-9]+)/$', views.SolarSystemView.as_view(), name='solar_system'),
    url('^n/(?P<pk>[0-9]+)/delete$', views.DeleteSolarSystemView.as_view(), name='delete_solar_system'),
    url('^n/(?P<pk>[0-9]+)/update$', views.UpdateSolarSystemView.as_view(), name='update_solar_system'),

    url('^n/(?P<pk>[0-9]+)/add-star$', views.AddStarView.as_view(), name='add_star'),
    url('^n/(?P<pk>[0-9]+)/delete-star$', views.DeleteStarView.as_view(), name='delete_star'),
    url('^n/(?P<pk>[0-9]+)/update-star$', views.UpdateStarView.as_view(), name='update_star'),

    url('^n/(?P<pk>[0-9]+)/add-planet$', views.AddPlanetView.as_view(), name='add_planet'),
    url('^p/(?P<pk>[0-9]+)/delete$', views.DeletePlanetView.as_view(), name='delete_planet'),
    url('^p/(?P<pk>[0-9]+)/update$', views.UpdatePlanetView.as_view(), name='update_planet'),

    url('^p/(?P<pk>[0-9]+)/add-moon$', views.AddMoonView.as_view(), name='add_moon'),
    url('^m/(?P<pk>[0-9]+)/delete$', views.DeleteMoonView.as_view(), name='delete_moon'),
    url('^m/(?P<pk>[0-9]+)/update$', views.UpdateMoonView.as_view(), name='update_moon'),
]
