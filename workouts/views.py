from django.views.generic import CreateView, ListView, DetailView, DeleteView
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth.decorators import login_required

from .models import Goal, Workout
from .forms import GoalForm, WorkoutForm


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
        goal.save()
        return super(AddGoalView, self).form_valid(form)

    def get_success_url(self):
        return 'goal/{}'.format(self.object.id)


class GoalsView(LoginRequiredMixin, ListView):

    model = Goal
    template_name = 'workouts/goals.html'
    login_url = '/login/'

    def get_queryset(self):
        return self.request.user.goal_set.all()


class GoalView(LoginRequiredMixin, DetailView):

    model = Goal
    template_name = 'workouts/goal.html'
    login_url = '/login/'

    def get_object(self):
        obj = get_object_or_404(Goal, pk=self.kwargs.get("pk"))
        if obj.owner != self.request.user:
            raise Http404
        return obj


class AddWorkoutView(LoginRequiredMixin, CreateView):

    model = Workout
    template_name = 'workouts/add_workout.html'
    form_class = WorkoutForm
    login_url = '/login/'

    def form_valid(self, form):
        workout = form.save(commit=False)
        workout.goal = get_object_or_404(Goal, pk=self.kwargs.get('pk'))
        if workout.goal.owner != self.request.user:
            return False
        workout.owner = self.request.user
        workout.save()
        return super(AddWorkoutView, self).form_valid(form)

    def get_success_url(self):
        return '/goal/{}'.format(self.object.goal.id)

    def get_initial(self):
        goal = get_object_or_404(Goal, pk=self.kwargs.get('pk'))
        if goal.owner != self.request.user:
            return {}
        return {
            'goal': goal
        }


class DeleteWorkoutView(LoginRequiredMixin, DeleteView):

    model = Workout
    template_name = 'workouts/delete_workout.html'
    login_url = '/login/'

    def get_success_url(self):
        return 'goal/{}'.format(self.object.goal.id)

    def get_object(self):
        workout = super(DeleteWorkoutView, self).get_object()
        if workout.owner != self.request.user:
            raise Http404
        return workout
