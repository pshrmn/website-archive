from django.forms import ModelForm, widgets
from django.core.exceptions import NON_FIELD_ERRORS

from .models import PlanetarySystem, Star, Planet, Moon


class PlanetarySystemForm(ModelForm):

    class Meta:
        model = PlanetarySystem
        fields = ('name', 'public', 'creator')

        widgets = {
            'creator': widgets.HiddenInput()
        }

        disabled = {
            'creator': True
        }


class StarForm(ModelForm):

    class Meta:
        model = Star
        fields = ('name', 'radius', 'creator')
        labels = {
            'name': 'Name',
            'radius': 'Radius (kms)'
        }
        error_messages = {
            'radius': {
                'invalid': 'Radius must be a whole number'
            }
        }

        widgets = {
            'creator': widgets.HiddenInput()
        }

        disabled = {
            'creator': True
        }


class PlanetForm(ModelForm):

    class Meta:
        model = Planet
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit', 'color',
                  'creator', 'planetarysystem')
        labels = {
            'name': 'Name',
            'radius': 'Radius',
            'distance': 'Distance from Star',
            'day_length': 'Day Length',
            'orbit': 'Orbital Period',
            'color': 'Color'
        }
        help_texts = {
            'radius': 'kilometers',
            'distance': 'million kilometers',
            'day_length': 'seconds',
            'orbit': 'days',
            'color': 'Hex value of what color the planet appears to be from afar (e.g. blue for Earth)'
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
            },
            NON_FIELD_ERRORS: {
                'unique_together': 'A planet with this name already exists in this system.'
            }
        }

        widgets = {
            'creator': widgets.HiddenInput(),
            'planetarysystem': widgets.HiddenInput()
        }

        disabled = {
            'creator': True,
            'planetarysystem': True
        }


class MoonForm(ModelForm):

    class Meta:
        model = Moon
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit', 'color',
                  'creator', 'planet')
        labels = {
            'name': 'Name',
            'radius': 'Radius',
            'distance': 'Distance from Planet',
            'day_length': 'Day Length',
            'orbit': 'Orbital Period',
            'color': 'Color'
        }
        help_texts = {
            'radius': 'kilometers',
            'distance': 'kilometers',
            'day_length': 'seconds',
            'orbit': 'days',
            'color': 'Hex value of what color the moon appears to be from afar'
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
            },
            NON_FIELD_ERRORS: {
                'unique_together': 'A moon with this name is already orbiting this planet.'
            }
        }

        widgets = {
            'creator': widgets.HiddenInput(),
            'planet': widgets.HiddenInput()
        }

        disabled = {
            'creator': True,
            'planet': True
        }
