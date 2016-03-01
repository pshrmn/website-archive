from django.views.generic import (CreateView, DeleteView, UpdateView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from solar_system.models import Moon, Planet
from solar_system.forms import MoonForm


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
