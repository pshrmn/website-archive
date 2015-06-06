from django.forms import ModelForm, RadioSelect, ModelChoiceField

from .models import Goal, Workout


class GoalForm(ModelForm):

    class Meta:
        model = Goal
        fields = ('trip', 'exercise')


class WorkoutForm(ModelForm):
    goal = ModelChoiceField(Goal.objects.all(), empty_label=None)

    class Meta:
        model = Workout
        fields = ('exercise', 'distance', 'goal')
        error_messages = {
            'exercise': {
                'required': 'Exercise type is required.'
            },
            'distance': {
                'required': 'Workout distance is required.'
            },
            'goal': {
                'required': 'The workout needs to be applied towards a goal'
            }
        }
        widgets = {
            'goal': RadioSelect()
        }
