from django.conf.urls import url, include

from . import views

urlpatterns = [
    url('^$', views.ListSolarSystems.as_view(), name='list_solar_systems'),
    url('^add$', views.AddSolarSystemView.as_view(), name='add_solar_system'),

    url('^(?P<pk>[0-9]+)/', include([
        url('^$', views.SolarSystemView.as_view(), name='solar_system'),
        url('^delete$', views.DeleteSolarSystemView.as_view(), name='delete_solar_system'),
        url('^update$', views.UpdateSolarSystemView.as_view(), name='update_solar_system'),

        url('^add-star$', views.AddStarView.as_view(), name='add_star'),
        url('^delete-star$', views.DeleteStarView.as_view(), name='delete_star'),
        url('^update-star$', views.UpdateStarView.as_view(), name='update_star'),

        url('^add-planet$', views.AddPlanetView.as_view(), name='add_planet'),
    ])),

    url('^planet/(?P<pk>[0-9]+)/', include([
        url('^delete$', views.DeletePlanetView.as_view(), name='delete_planet'),
        url('^update$', views.UpdatePlanetView.as_view(), name='update_planet'),
        url('^add-moon$', views.AddMoonView.as_view(), name='add_moon'),
    ])),

    url('^moon/(?P<pk>[0-9]+)/', include([
        url('^delete$', views.DeleteMoonView.as_view(), name='delete_moon'),
        url('^update$', views.UpdateMoonView.as_view(), name='update_moon'),
    ]))
]
