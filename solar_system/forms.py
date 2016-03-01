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


class PlanetForm(ModelForm):

    class Meta:
        model = Planet
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit')


class MoonForm(ModelForm):

    class Meta:
        model = Moon
        fields = ('name', 'radius', 'distance', 'day_length', 'orbit')
