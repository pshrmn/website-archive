from django.views.generic import CreateView, ListView, DetailView

from braces.views import LoginRequiredMixin

from .models import Goal, Workout
from .forms import GoalForm, WorkoutForm


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


class GoalView(LoginRequiredMixin, DetailView):

    model = Goal
    template_name = 'workouts/goal.html'
    login_url = '/login/'


class AddWorkoutView(LoginRequiredMixin, CreateView):

    model = Workout
    template_name = 'workouts/add_workout.html'
    form_class = WorkoutForm
    login_url = '/login/'

    def form_valid(self, form):
        workout = form.save(commit=False)
        workout.owner = self.request.user
        workout.save()
        return super(AddWorkoutView, self).form_valid(form)

    def get_success_url(self):
        return 'goal/{}'.format(self.object.goal.id)
