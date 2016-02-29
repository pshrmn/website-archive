from django.forms import ModelForm

from .models import SolarSystem


class SolarSystemForm(ModelForm):

    class Meta:
        model = SolarSystem
        fields = ('name', 'public')
