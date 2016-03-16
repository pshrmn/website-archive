import re
from django import forms
from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import ugettext_lazy as _

color_re = re.compile('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
validate_color = RegexValidator(color_re, _('Enter a valid color.'), 'invalid')


class ColorWidget(forms.TextInput):

    class Media:
        js = ('colorfield2/js/jscolor.min.js',)


class ColorField(models.CharField):
    default_validators = [validate_color]

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 10
        super(ColorField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        kwargs['widget'] = ColorWidget(attrs={'class': 'jscolor'})
        return super(ColorField, self).formfield(**kwargs)
