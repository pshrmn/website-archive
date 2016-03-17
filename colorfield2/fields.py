import re
from django import forms
from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import ugettext_lazy as _

color_re = re.compile('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
validate_color = RegexValidator(color_re, _('Enter a valid color.'), 'invalid')


class HexColorWidget(forms.TextInput):

    class Media:
        js = ('colorfield2/js/jscolor.min.js',)


class HexColorFormField(forms.CharField):

    widget = HexColorWidget(attrs={'class': 'jscolor'})

    def to_python(self, value):
        """
        if the value does not start with a # sign,
        append it to the beginning. jscolor doesn't
        add a # sign at the beginning of the hex
        value.
        """
        value = super().to_python(value)
        if not value.startswith('#'):
            return '#%s' % value
        return value


class HexColorField(models.CharField):

    """
    A field that takes a # sign followed by a
    length 3 or 6 hex value
    """
    default_validators = [validate_color]

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 10
        super().__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        defaults = {'form_class': HexColorFormField}
        defaults.update(kwargs)
        return super().formfield(**defaults)
