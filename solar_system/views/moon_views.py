from django.views.generic import (CreateView, DeleteView, UpdateView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from solar_system.models import Moon, Planet
from solar_system.forms import MoonForm


class AddMoonView(LoginRequiredMixin, CreateView):

    model = Moon
    template_name = 'solar_systems/forms/add_moon.html'
    form_class = MoonForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['planet_id'] = self.kwargs.get('pk')
        return context

    def form_valid(self, form):
        planet = get_object_or_404(Planet, pk=self.kwargs.get('pk'))
        if planet.creator != self.request.user:
            raise Http404
        form.instance.planet = planet
        form.instance.creator = self.request.user
        return super(AddMoonView, self).form_valid(form)

    def get_success_url(self):
        return '/solar-systems/{}/'.format(self.object.planet.star.solarsystem.id)


class DeleteMoonView(LoginRequiredMixin, DeleteView):

    model = Moon
    template_name = 'solar_systems/forms/delete_moon.html'

    def get_success_url(self):
        return '/solar-systems/{}/'.format(self.object.planet.star.solarsystem.id)

    def get_object(self):
        star = super().get_object()
        if star.creator != self.request.user:
            raise Http404
        return star


class UpdateMoonView(LoginRequiredMixin, UpdateView):

    model = Moon
    template_name = 'solar_systems/forms/update_moon.html'
    form_class = MoonForm

    def get_object(self):
        obj = super().get_object()
        if obj.creator != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/solar-systems/{}/'.format(self.object.planet.star.solarsystem.id)
