from django.views.generic import (CreateView, DeleteView, UpdateView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from solar_system.models import Planet, Star
from solar_system.forms import PlanetForm


class AddPlanetView(LoginRequiredMixin, CreateView):

    model = Planet
    template_name = 'solar_systems/forms/add_planet.html'
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
        return '/solar-systems/{}/'.format(self.object.star.solarsystem.id)


class DeletePlanetView(LoginRequiredMixin, DeleteView):

    model = Planet
    template_name = 'solar_systems/forms/delete_planet.html'

    def get_success_url(self):
        return '/solar-systems/{}/'.format(self.object.star.solarsystem.id)

    def get_object(self):
        planet = super().get_object()
        if planet.creator != self.request.user:
            raise Http404
        return planet


class UpdatePlanetView(LoginRequiredMixin, UpdateView):

    model = Planet
    template_name = 'solar_systems/forms/update_planet.html'
    form_class = PlanetForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/solar-systems/{}/'.format(self.object.star.solarsystem.id)
