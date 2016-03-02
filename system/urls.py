from django.conf.urls import url, include

from . import views

urlpatterns = [
    url('^$', views.ListPlanetarySystems.as_view(), name='list_systems'),
    url('^public$', views.PublicPlanetarySystems.as_view(), name='public_systems'),
    url('^add$', views.AddPlanetarySystemView.as_view(), name='add_system'),

    url('^(?P<pk>[0-9]+)/', include([
        url('^$', views.PlanetarySystemView.as_view(), name='system'),
        url('^delete$', views.DeletePlanetarySystemView.as_view(), name='delete_system'),
        url('^update$', views.UpdatePlanetarySystemView.as_view(), name='update_system'),

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
