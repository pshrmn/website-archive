from django.views.generic import (CreateView, DeleteView, UpdateView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from system.models import Star, PlanetarySystem
from system.forms import StarForm


class AddStarView(LoginRequiredMixin, CreateView):

    model = Star
    template_name = 'systems/star/add.html'
    form_class = StarForm

    def get_initial(self):
        initial = super().get_initial()
        initial['creator'] = self.request.user
        return initial

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['planetary_system'] = self.kwargs.get('system_name')
        context['username'] = self.kwargs.get('username')
        return context

    def form_valid(self, form):
        planetarysystem = get_object_or_404(
            PlanetarySystem,
            name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if planetarysystem.creator != self.request.user:
            raise Http404
        form.instance.planetarysystem = planetarysystem
        form.instance.creator = self.request.user
        return super(AddStarView, self).form_valid(form)

    def get_success_url(self):
        return self.object.planetarysystem.get_absolute_url()


class DeleteStarView(LoginRequiredMixin, DeleteView):

    model = Star
    template_name = 'systems/star/delete.html'

    def get_success_url(self):
        return self.object.planetarysystem.get_absolute_url()

    def get_object(self):
        # roundabout, but get the star based on the planetary system
        planetarysystem = get_object_or_404(
            PlanetarySystem,
            name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if planetarysystem.creator != self.request.user:
            raise Http404
        return planetarysystem.star_set.first()


class UpdateStarView(LoginRequiredMixin, UpdateView):

    model = Star
    template_name = 'systems/star/update.html'
    form_class = StarForm

    def get_object(self):
        # roundabout, but get the star based on the planetary system
        planetarysystem = get_object_or_404(
            PlanetarySystem,
            name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if planetarysystem.creator != self.request.user:
            raise Http404
        return planetarysystem.star_set.first()

    def get_success_url(self):
        return self.object.planetarysystem.get_absolute_url()
