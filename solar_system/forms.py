from django.forms import ModelForm

from .models import SolarSystem, Star, Planet, Moon


class SolarSystemForm(ModelForm):

    class Meta:
        model = SolarSystem
        fields = ('name', 'public')


class StarForm(ModelForm):

    class Meta:
        model = Star
        fields = ('name', 'radius')
        labels = {
            'name': 'Name',
            'radius': 'Radius (kms)'
        }


class PlanetForm(ModelForm):

    class Meta:
        model = Planet
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit')
        labels = {
            'name': 'Name',
            'radius': 'Radius (kms)',
            'distance': 'Distance from Star (million kms)',
            'day_length': 'Day Length (seconds)',
            'orbit': 'Orbital Period (second)'
        }


class MoonForm(ModelForm):

    class Meta:
        model = Moon
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit')
        labels = {
            'name': 'Name',
            'radius': 'Radius (kms)',
            'distance': 'Distance from Planet (million kms)',
            'day_length': 'Day Length (seconds)',
            'orbit': 'Orbital Period (second)'
        }
