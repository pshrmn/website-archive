import json
from django.views.generic import (CreateView, DeleteView, UpdateView,
                                  ListView, DetailView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse

from system.models import PlanetarySystem
from system.forms import PlanetarySystemForm


class ListPlanetarySystems(LoginRequiredMixin, ListView):

    model = PlanetarySystem
    template_name = 'systems/planetary_system/list.html'

    def get_queryset(self):
        return self.request.user.planetarysystem_set.all()


class PublicPlanetarySystems(ListView):
    template_name = "systems/planetary_system/public_list.html"
    model = PlanetarySystem

    def get_queryset(self):
        return PlanetarySystem.objects.filter(public=True)


class PlanetarySystemView(DetailView):

    model = PlanetarySystem
    template_name = 'systems/planetary_system/detail.html'

    def get_object(self):
        planetary_system = get_object_or_404(
            PlanetarySystem,
            name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username'))
        if not planetary_system.public and planetary_system.creator != self.request.user:
            raise Http404
        return planetary_system

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.kwargs)
        context['is_creator'] = self.request.user == context['planetarysystem'].creator
        context['planetary_system_json'] = json.dumps(context['planetarysystem'].to_json())
        return context


class AddPlanetarySystemView(LoginRequiredMixin, CreateView):

    model = PlanetarySystem
    template_name = 'systems/planetary_system/add.html'
    form_class = PlanetarySystemForm

    def get_initial(self):
        initial = super().get_initial()
        initial['creator'] = self.request.user
        return initial

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.kwargs)
        return context

    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super(AddPlanetarySystemView, self).form_valid(form)

    def get_success_url(self):
        return self.object.get_absolute_url()


class DeletePlanetarySystemView(LoginRequiredMixin, DeleteView):

    model = PlanetarySystem
    template_name = 'systems/planetary_system/delete.html'

    def get_success_url(self):
        return reverse(
            'list_systems',
            kwargs={
                'username': self.request.user.username
            }
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.kwargs)
        return context

    def get_object(self):
        planetary_system = get_object_or_404(
            PlanetarySystem,
            name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username'))
        if planetary_system.creator != self.request.user:
            raise Http404
        return planetary_system


class UpdatePlanetarySystemView(LoginRequiredMixin, UpdateView):

    model = PlanetarySystem
    template_name = 'systems/planetary_system/update.html'
    form_class = PlanetarySystemForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.kwargs)
        return context

    def get_object(self):
        planetary_system = get_object_or_404(
            PlanetarySystem,
            name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username'))
        if planetary_system.creator != self.request.user:
            raise Http404
        return planetary_system

    def get_success_url(self):
        return self.object.get_absolute_url()
