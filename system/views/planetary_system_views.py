import json
from django.views.generic import (CreateView, DeleteView, UpdateView,
                                  ListView, DetailView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from system.models import PlanetarySystem
from system.forms import PlanetarySystemForm


class ListPlanetarySystems(LoginRequiredMixin, ListView):

    model = PlanetarySystem
    template_name = 'systems/list_planetary_systems.html'

    def get_queryset(self):
        return self.request.user.planetarysystem_set.all()


class PublicPlanetarySystems(ListView):
    template_name = "systems/public_planetary_systems.html"
    model = PlanetarySystem

    def get_queryset(self):
        return PlanetarySystem.objects.filter(public=True)


class PlanetarySystemView(DetailView):

    model = PlanetarySystem
    template_name = 'systems/planetary_system.html'

    def get_object(self):
        planetary_system = get_object_or_404(PlanetarySystem, pk=self.kwargs.get("pk"))
        if not planetary_system.public and planetary_system.creator != self.request.user:
            raise Http404
        return planetary_system

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_creator'] = self.request.user == context['planetarysystem'].creator
        context['planetary_system_json'] = self.make_json(context['planetarysystem'])
        return context

    @staticmethod
    def make_json(planetary_system):
        # only one star per system until I solve the n-body problem :)
        stars = planetary_system.star_set.all()
        ss = {
            "name": planetary_system.name,
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


class AddPlanetarySystemView(LoginRequiredMixin, CreateView):

    model = PlanetarySystem
    template_name = 'systems/forms/add_planetary_system.html'
    form_class = PlanetarySystemForm

    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super(AddPlanetarySystemView, self).form_valid(form)

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.id)


class DeletePlanetarySystemView(LoginRequiredMixin, DeleteView):

    model = PlanetarySystem
    template_name = 'systems/forms/delete_planetary_system.html'

    def get_success_url(self):
        return '/systems/'

    def get_object(self):
        planetary_system = super().get_object()
        if planetary_system.creator != self.request.user:
            raise Http404
        return planetary_system


class UpdatePlanetarySystemView(LoginRequiredMixin, UpdateView):

    model = PlanetarySystem
    template_name = 'systems/forms/update_planetary_system.html'
    form_class = PlanetarySystemForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.id)
