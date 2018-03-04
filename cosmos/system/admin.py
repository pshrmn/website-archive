from django.contrib import admin

from .models import PlanetarySystem, Star, Planet, Moon

admin.site.register(PlanetarySystem)
admin.site.register(Star)
admin.site.register(Planet)
admin.site.register(Moon)
