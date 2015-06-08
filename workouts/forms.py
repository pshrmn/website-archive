from django.forms import ModelForm

from .models import Goal, Workout


class GoalForm(ModelForm):

    class Meta:
        model = Goal
        fields = ('start', 'end')

    def is_valid(self):
        valid = super().is_valid()
        if not valid:
            return valid
        start = self.cleaned_data['start']
        end = self.cleaned_data['end']
        if start == end:
            self._errors['end'] = ['Cannot end at starting location']
            return False
        return True


class WorkoutForm(ModelForm):

    class Meta:
        model = Workout
        fields = ('exercise', 'distance')
        error_messages = {
            'exercise': {
                'required': 'Exercise type is required.'
            },
            'distance': {
                'required': 'Workout distance is required.'
            }
        }
