from django.views.generic import (CreateView, DeleteView, UpdateView, DetailView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from system.models import Planet, PlanetarySystem
from system.forms import PlanetForm
from system.helpers import pretty_time


class PlanetView(DetailView):

    model = Planet
    template_name = 'systems/planet/detail.html'

    def get_object(self):
        planet = get_object_or_404(
            Planet,
            name=self.kwargs.get('planet_name').replace('+', ' '),
            planetarysystem__name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if planet.creator != self.request.user and not planet.planetarysystem.public:
            raise Http404
        return planet

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # cut off any decimal places
        light_seconds = int(context['planet'].light_time())
        # figure out how many hours
        context['light_time'] = pretty_time(light_seconds)
        context['day_length'] = pretty_time(context['planet'].day_length)
        context['system_name'] = self.kwargs.get('system_name')
        context['username'] = self.kwargs.get('username')
        return context


class AddPlanetView(LoginRequiredMixin, CreateView):

    model = Planet
    template_name = 'systems/planet/add.html'
    form_class = PlanetForm

    def get_initial(self):
        initial = super().get_initial()
        initial['creator'] = self.request.user
        initial['planetarysystem'] = get_object_or_404(
            PlanetarySystem,
            name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username'))
        return initial

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['username'] = self.kwargs.get('username')
        context['system_name'] = self.kwargs.get('system_name')
        return context

    def form_valid(self, form):
        if form.instance.planetarysystem.creator != self.request.user:
            raise Http404
        return super(AddPlanetView, self).form_valid(form)

    def get_success_url(self):

        return self.object.get_absolute_url()


class DeletePlanetView(LoginRequiredMixin, DeleteView):

    model = Planet
    template_name = 'systems/planet/delete.html'

    def get_success_url(self):
        return self.object.planetarysystem.get_absolute_url()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['system_name'] = self.kwargs.get('system_name')
        context['username'] = self.kwargs.get('username')
        return context

    def get_object(self):
        planet = get_object_or_404(
            Planet,
            name=self.kwargs.get('planet_name').replace('+', ' '),
            planetarysystem__name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if planet.creator != self.request.user:
            raise Http404
        return planet


class UpdatePlanetView(LoginRequiredMixin, UpdateView):

    model = Planet
    template_name = 'systems/planet/update.html'
    form_class = PlanetForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['system_name'] = self.kwargs.get('system_name')
        context['username'] = self.kwargs.get('username')
        return context

    def get_object(self):
        planet = get_object_or_404(
            Planet,
            name=self.kwargs.get('planet_name').replace('+', ' '),
            planetarysystem__name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if planet.creator != self.request.user:
            raise Http404
        return planet

    def get_success_url(self):
        return self.object.get_absolute_url()
