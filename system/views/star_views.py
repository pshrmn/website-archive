from django.views.generic import (CreateView, DeleteView, UpdateView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from system.models import Star, PlanetarySystem
from system.forms import StarForm


class AddStarView(LoginRequiredMixin, CreateView):

    model = Star
    template_name = 'systems/forms/add_star.html'
    form_class = StarForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['planetary_system_id'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        planetarysystem = get_object_or_404(PlanetarySystem, pk=self.kwargs.get('pk'))
        if planetarysystem.creator != self.request.user:
            raise Http404
        form.instance.planetarysystem = planetarysystem
        form.instance.creator = self.request.user
        return super(AddStarView, self).form_valid(form)

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.planetarysystem.id)


class DeleteStarView(LoginRequiredMixin, DeleteView):

    model = Star
    template_name = 'systems/forms/delete_star.html'

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.planetarysystem.id)

    def get_object(self):
        star = super().get_object()
        if star.creator != self.request.user:
            raise Http404
        return star


class UpdateStarView(LoginRequiredMixin, UpdateView):

    model = Star
    template_name = 'systems/forms/update_star.html'
    form_class = StarForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/systems/{}/'.format(self.object.planetarysystem.id)
