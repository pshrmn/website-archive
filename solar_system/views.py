from django.views.generic import (CreateView, DeleteView, DetailView,
                                  UpdateView, ListView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import SolarSystem, Star, Planet, Moon
from .forms import SolarSystemForm, StarForm, PlanetForm, MoonForm

"""
solar system
"""


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
        return context


class AddSolarSystemView(LoginRequiredMixin, CreateView):

    model = SolarSystem
    template_name = 'solar_systems/add_solar_system.html'
    form_class = SolarSystemForm

    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super(AddSolarSystemView, self).form_valid(form)

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.id)


class DeleteSolarSystemView(LoginRequiredMixin, DeleteView):

    model = SolarSystem
    template_name = 'solar_systems/delete_solar_system.html'

    def get_success_url(self):
        return '/solar-systems'

    def get_object(self):
        solar_system = super().get_object()
        if solar_system.creator != self.request.user:
            raise Http404
        return solar_system


class UpdateSolarSystemView(LoginRequiredMixin, UpdateView):

    model = SolarSystem
    template_name = 'solar_systems/update_solar_system.html'
    form_class = SolarSystemForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.id)


"""
star
"""


class AddStarView(LoginRequiredMixin, CreateView):

    model = Star
    template_name = 'solar_systems/add_star.html'
    form_class = StarForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['solar_system_id'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        form.instance.solarsystem = get_object_or_404(SolarSystem, pk=self.kwargs.get('pk'))
        form.instance.creator = self.request.user
        return super(AddStarView, self).form_valid(form)

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.solarsystem.id)


class DeleteStarView(LoginRequiredMixin, DeleteView):

    model = Star
    template_name = 'solar_systems/delete_star.html'

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.solarsystem.id)

    def get_object(self):
        star = super().get_object()
        if star.creator != self.request.user:
            raise Http404
        return star


class UpdateStarView(LoginRequiredMixin, UpdateView):

    model = Star
    template_name = 'solar_systems/update_star.html'
    form_class = StarForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.solarsystem.id)

"""
planet
"""


class AddPlanetView(LoginRequiredMixin, CreateView):

    model = Planet
    template_name = 'solar_systems/add_planet.html'
    form_class = PlanetForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['star_id'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        form.instance.star = get_object_or_404(Star, pk=self.kwargs.get('pk'))
        form.instance.creator = self.request.user
        return super(AddPlanetView, self).form_valid(form)

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.star.solarsystem.id)


class DeletePlanetView(LoginRequiredMixin, DeleteView):

    model = Planet
    template_name = 'solar_systems/delete_planet.html'

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.star.solarsystem.id)

    def get_object(self):
        planet = super().get_object()
        if planet.creator != self.request.user:
            raise Http404
        return planet


class UpdatePlanetView(LoginRequiredMixin, UpdateView):

    model = Planet
    template_name = 'solar_systems/update_planet.html'
    form_class = PlanetForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.star.solarsystem.id)

"""
moon
"""


class AddMoonView(LoginRequiredMixin, CreateView):

    model = Moon
    template_name = 'solar_systems/add_moon.html'
    form_class = MoonForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['planet_id'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        form.instance.planet = get_object_or_404(Planet, pk=self.kwargs.get('pk'))
        form.instance.creator = self.request.user
        return super(AddMoonView, self).form_valid(form)

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.planet.star.solarsystem.id)


class DeleteMoonView(LoginRequiredMixin, DeleteView):

    model = Moon
    template_name = 'solar_systems/delete_moon.html'

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.planet.star.solarsystem.id)

    def get_object(self):
        star = super().get_object()
        if star.creator != self.request.user:
            raise Http404
        return star


class UpdateMoonView(LoginRequiredMixin, UpdateView):

    model = Moon
    template_name = 'solar_systems/update_moon.html'
    form_class = MoonForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/solar-systems/n/{}'.format(self.object.planet.star.solarsystem.id)
