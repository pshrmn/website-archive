from django.contrib import admin

from .models import SolarSystem, Star, Planet, Moon

admin.site.register(SolarSystem)
admin.site.register(Star)
admin.site.register(Planet)
admin.site.register(Moon)
