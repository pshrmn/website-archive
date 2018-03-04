from django.views.generic import (CreateView, DeleteView, UpdateView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.mixins import LoginRequiredMixin

from system.models import Moon, Planet
from system.forms import MoonForm


class AddMoonView(LoginRequiredMixin, CreateView):

    model = Moon
    template_name = 'systems/moon/add.html'
    form_class = MoonForm

    def get_initial(self):
        initial = super().get_initial()
        initial['creator'] = self.request.user
        initial['planet'] = get_object_or_404(
            Planet,
            name=self.kwargs.get('planet_name').replace('+', ' '),
            planetarysystem__name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        return initial

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.kwargs)
        return context

    def form_valid(self, form):
        if form.instance.planet.creator != self.request.user:
            raise Http404
        return super(AddMoonView, self).form_valid(form)

    def get_success_url(self):
        return self.object.planet.get_absolute_url()


class DeleteMoonView(LoginRequiredMixin, DeleteView):

    model = Moon
    template_name = 'systems/moon/delete.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.kwargs)
        return context

    def get_success_url(self):
        return self.object.planet.get_absolute_url()

    def get_object(self):
        moon = get_object_or_404(
            Moon,
            name=self.kwargs.get('moon_name').replace('+', ' '),
            planet__name=self.kwargs.get('planet_name').replace('+', ' '),
            planet__planetarysystem__name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if moon.creator != self.request.user:
            raise Http404
        return moon


class UpdateMoonView(LoginRequiredMixin, UpdateView):

    model = Moon
    template_name = 'systems/moon/update.html'
    form_class = MoonForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.kwargs)
        return context

    def get_object(self):
        moon = get_object_or_404(
            Moon,
            name=self.kwargs.get('moon_name').replace('+', ' '),
            planet__name=self.kwargs.get('planet_name').replace('+', ' '),
            planet__planetarysystem__name=self.kwargs.get('system_name').replace('+', ' '),
            creator__username=self.kwargs.get('username')
        )
        if moon.creator != self.request.user:
            raise Http404
        return moon

    def get_success_url(self):
        return self.object.planet.get_absolute_url()
