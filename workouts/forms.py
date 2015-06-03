from django.forms import ModelForm

from .models import Goal, Workout


class GoalForm(ModelForm):

    class Meta:
        model = Goal
        fields = ('trip', 'exercise')


class WorkoutForm(ModelForm):

    class Meta:
        model = Workout
        fields = ('exercise', 'distance')
