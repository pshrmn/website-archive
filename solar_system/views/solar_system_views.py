import json
from django.views.generic import (CreateView, DeleteView, UpdateView,
                                  ListView, DetailView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from solar_system.models import SolarSystem
from solar_system.forms import SolarSystemForm


class ListSolarSystems(LoginRequiredMixin, ListView):

    model = SolarSystem
    template_name = 'solar_systems/list_solar_systems.html'

    def get_queryset(self):
        return self.request.user.solarsystem_set.all()


class SolarSystemView(DetailView):

    model = SolarSystem
    template_name = 'solar_systems/solar_system.html'

    def get_object(self):
        solar_system = get_object_or_404(SolarSystem, pk=self.kwargs.get("pk"))
        if not solar_system.public and solar_system.creator != self.request.user:
            raise Http404
        return solar_system

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_creator'] = self.request.user == context['solarsystem'].creator
        context['solar_system_json'] = self.make_json(context['solarsystem'])
        return context

    @staticmethod
    def make_json(solar_system):
        # only one star per solar system (use one-to-one?)
        stars = solar_system.star_set.all()
        ss = {
            "name": solar_system.name,
        }
        if len(stars) > 0:
            star = stars[0]
            ss["star"] = {
                "name": star.name,
                "radius": star.radius,
                "planets": []
            }
            for planet in star.planet_set.all():
                p = {
                    "name": planet.name,
                    "radius": planet.radius,
                    "distance": planet.distance,
                    "day_length": planet.day_length,
                    "orbit": planet.orbit,
                    "moons": []
                }
                for moon in planet.moon_set.all():
                    p["moons"].append({
                        "name": moon.name,
                        "radius": moon.radius,
                        "distance": moon.distance,
                        "day_length": moon.day_length,
                        "orbit": moon.orbit,
                    })
                ss["star"]["planets"].append(p)
        else:
            ss["star"] = []
        return json.dumps(ss)


class AddSolarSystemView(LoginRequiredMixin, CreateView):

    model = SolarSystem
    template_name = 'solar_systems/forms/add_solar_system.html'
    form_class = SolarSystemForm

    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super(AddSolarSystemView, self).form_valid(form)

    def get_success_url(self):
        return '/solar-systems/{}/'.format(self.object.id)


class DeleteSolarSystemView(LoginRequiredMixin, DeleteView):

    model = SolarSystem
    template_name = 'solar_systems/forms/delete_solar_system.html'

    def get_success_url(self):
        return '/solar-systems/'

    def get_object(self):
        solar_system = super().get_object()
        if solar_system.creator != self.request.user:
            raise Http404
        return solar_system


class UpdateSolarSystemView(LoginRequiredMixin, UpdateView):

    model = SolarSystem
    template_name = 'solar_systems/forms/update_solar_system.html'
    form_class = SolarSystemForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/solar-systems/{}/'.format(self.object.id)
