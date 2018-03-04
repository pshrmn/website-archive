from django.views.generic import (CreateView, ListView, DetailView,
                                  DeleteView, UpdateView)
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.decorators import login_required

from .models import Goal, Workout
from distances.models import Location
from .forms import GoalForm, WorkoutForm
from .helpers import haversine


class LoginRequiredMixin(object):

    @classmethod
    def as_view(cls, **initkwargs):
        view = super(LoginRequiredMixin, cls).as_view(**initkwargs)
        return login_required(view)


class AddGoalView(LoginRequiredMixin, CreateView):

    model = Goal
    template_name = 'workouts/add_goal.html'
    form_class = GoalForm
    login_url = '/login/'

    def form_valid(self, form):
        goal = form.save(commit=False)
        goal.owner = self.request.user
        goal.length = round(haversine(goal.start, goal.end))
        goal.save()
        return super(AddGoalView, self).form_valid(form)

    def get_success_url(self):
        return 'goal/{}'.format(self.object.id)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cities'] = Location.objects.all()
        return context


class DeleteGoalView(LoginRequiredMixin, DeleteView):

    model = Goal
    template_name = 'workouts/delete_goal.html'
    login_url = '/login/'

    def get_success_url(self):
        return '/goals/'

    def get_object(self):
        goal = super().get_object()
        if goal.owner != self.request.user:
            raise Http404
        return goal


class UpdateGoalView(LoginRequiredMixin, UpdateView):

    model = Goal
    template_name = 'workouts/update_goal.html'
    form_class = GoalForm
    login_url = '/login'

    def get_object(self):
        obj = super().get_object()
        if obj.owner != self.request.user:
            raise Http404
        return obj

    def get_success_url(self):
        return '/goal/{}'.format(self.object.id)

    def form_valid(self, form):
        goal = form.save(commit=False)
        # update the length
        goal.length = round(haversine(goal.start, goal.end))
        goal.complete = goal.progress >= goal.length
        goal.save()
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cities'] = Location.objects.all()
        return context


class GoalsView(LoginRequiredMixin, ListView):

    model = Goal
    template_name = 'workouts/goals.html'
    login_url = '/login/'

    def get_queryset(self):
        return self.request.user.goal_set.all()


class GoalView(DetailView):

    model = Goal
    template_name = 'workouts/goal.html'
    login_url = '/login/'

    def get_object(self):
        goal = get_object_or_404(Goal, pk=self.kwargs.get("pk"))
        if not goal.public and goal.owner != self.request.user:
            raise Http404
        return goal

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print(self.request.user)
        context['is_owner'] = self.request.user == context['goal'].owner
        return context


class AddWorkoutView(LoginRequiredMixin, CreateView):

    model = Workout
    template_name = 'workouts/add_workout.html'
    form_class = WorkoutForm
    login_url = '/login/'

    def dispatch(self, request, *args, **kwargs):
        """
        check if user has permission to add workout to the current goal
        before processing request
        """
        goal = get_object_or_404(Goal, pk=self.kwargs.get('pk'))
        if request.user != goal.owner:
            raise Http404
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        workout = form.save(commit=False)
        goal = get_object_or_404(Goal, pk=self.kwargs.get('pk'))
        workout.goal = goal
        if workout.goal.owner != self.request.user:
            return False
        workout.owner = self.request.user
        workout.save()
        goal.progress += workout.distance
        if not goal.complete and goal.progress > goal.length:
            goal.complete = True
        goal.save()
        return super().form_valid(form)

    def get_success_url(self):
        return '/goal/{}'.format(self.object.goal.id)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['goal'] = get_object_or_404(Goal, pk=self.kwargs.get('pk'))
        return context


class DeleteWorkoutView(LoginRequiredMixin, DeleteView):

    model = Workout
    template_name = 'workouts/delete_workout.html'
    login_url = '/login/'

    def get_success_url(self):
        print('getting success url')
        return '/goal/{}'.format(self.object.goal.id)

    def get_object(self):
        workout = super().get_object()
        if workout.owner != self.request.user:
            raise Http404
        return workout

    def delete(self, request, *args, **kwargs):
        """
        when deleting, update goal's complete value
        """
        # need to get the workout's goal before deleting the workout
        workout = super().get_object()
        goal = workout.goal
        goal.progress -= workout.distance
        if goal.complete and goal.progress < goal.length:
            goal.complete = False
        goal.save()
        return super().delete(request, *args, **kwargs)
