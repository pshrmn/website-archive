from django.forms import ModelForm

from .models import PlanetarySystem, Star, Planet, Moon


class PlanetarySystemForm(ModelForm):

    class Meta:
        model = PlanetarySystem
        fields = ('name', 'public')


class StarForm(ModelForm):

    class Meta:
        model = Star
        fields = ('name', 'radius')
        labels = {
            'name': 'Name',
            'radius': 'Radius (kms)'
        }
        error_messages = {
            'radius': {
                'invalid': 'Radius must be a whole number'
            }
        }


class PlanetForm(ModelForm):

    class Meta:
        model = Planet
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit')
        labels = {
            'name': 'Name',
            'radius': 'Radius',
            'distance': 'Distance from Star',
            'day_length': 'Day Length',
            'orbit': 'Orbital Period'
        }
        help_texts = {
            'radius': 'kilometers',
            'distance': 'million kilometers',
            'day_length': 'seconds',
            'orbit': 'days'
        }
        error_messages = {
            'radius': {
                'invalid': 'Radius must be a whole number'
            },
            'distance': {
                'invalid': 'Distance must be a whole number'
            },
            'day_length': {
                'invalid': 'Day length must be a whole number'
            },
            'orbit': {
                'invalid': 'Orbit must be a whole number'
            }
        }


class MoonForm(ModelForm):

    class Meta:
        model = Moon
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit')
        labels = {
            'name': 'Name',
            'radius': 'Radius',
            'distance': 'Distance from Planet',
            'day_length': 'Day Length',
            'orbit': 'Orbital Period'
        }
        help_texts = {
            'radius': 'kilometers',
            'distance': 'kilometers',
            'day_length': 'seconds',
            'orbit': 'days'
        }
        error_messages = {
            'radius': {
                'invalid': 'Radius must be a whole number'
            },
            'distance': {
                'invalid': 'Distance must be a whole number'
            },
            'day_length': {
                'invalid': 'Day length must be a whole number'
            },
            'orbit': {
                'invalid': 'Orbit must be a whole number'
            }
        }
