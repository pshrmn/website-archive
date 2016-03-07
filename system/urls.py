from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^$', views.ListPlanetarySystems.as_view(), name='list_systems'),
    url(r'^public$', views.PublicPlanetarySystems.as_view(), name='public_systems'),
    url(r'^add$', views.AddPlanetarySystemView.as_view(), name='add_system'),

    url(r'^(?P<pk>[0-9]+)/', include([
        url(r'^$', views.PlanetarySystemView.as_view(), name='system'),
        url(r'^delete$', views.DeletePlanetarySystemView.as_view(), name='delete_system'),
        url(r'^update$', views.UpdatePlanetarySystemView.as_view(), name='update_system'),

        url(r'^add-star$', views.AddStarView.as_view(), name='add_star'),
        url(r'^delete-star$', views.DeleteStarView.as_view(), name='delete_star'),
        url(r'^update-star$', views.UpdateStarView.as_view(), name='update_star'),

        url(r'^add-planet$', views.AddPlanetView.as_view(), name='add_planet'),
    ])),

    url(r'^planet/(?P<pk>[0-9]+)/', include([
        url(r'^delete$', views.DeletePlanetView.as_view(), name='delete_planet'),
        url(r'^update$', views.UpdatePlanetView.as_view(), name='update_planet'),
        url(r'^add-moon$', views.AddMoonView.as_view(), name='add_moon'),
    ])),

    url(r'^moon/(?P<pk>[0-9]+)/', include([
        url(r'^delete$', views.DeleteMoonView.as_view(), name='delete_moon'),
        url(r'^update$', views.UpdateMoonView.as_view(), name='update_moon'),
    ]))
]
