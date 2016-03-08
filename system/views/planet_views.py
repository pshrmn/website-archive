from django.views.generic import (CreateView, DeleteView, UpdateView, DetailView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from system.models import Planet, Star
from system.forms import PlanetForm
from system.helpers import pretty_time


class PlanetView(DetailView):

    model = Planet
    template_name = 'systems/planet.html'

    def get_object(self):
        pk = self.kwargs.get('pk')
        planet = get_object_or_404(Planet, pk=pk)
        if not planet.star.planetarysystem.public and \
           planet.creator != self.request.user:
            raise Http404
        return planet

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # cut off any decimal places
        light_seconds = int(context['planet'].light_time())
        # figure out how many hours
        context['light_time'] = pretty_time(light_seconds)
        context['day_length'] = pretty_time(context['planet'].day_length)

        context['ps'] = context['planet'].star.planetarysystem
        return context


class AddPlanetView(LoginRequiredMixin, CreateView):

    model = Planet
    template_name = 'systems/forms/add_planet.html'
    form_class = PlanetForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['star_id'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        star = get_object_or_404(Star, pk=self.kwargs.get('pk'))
        if star.creator != self.request.user:
            raise Http404
        form.instance.star = star
        form.instance.creator = self.request.user
        return super(AddPlanetView, self).form_valid(form)

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.star.planetarysystem.id)


class DeletePlanetView(LoginRequiredMixin, DeleteView):

    model = Planet
    template_name = 'systems/forms/delete_planet.html'

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.star.planetarysystem.id)

    def get_object(self):
        planet = super().get_object()
        if planet.creator != self.request.user:
            raise Http404
        return planet


class UpdatePlanetView(LoginRequiredMixin, UpdateView):

    model = Planet
    template_name = 'systems/forms/update_planet.html'
    form_class = PlanetForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.star.planetarysystem.id)
