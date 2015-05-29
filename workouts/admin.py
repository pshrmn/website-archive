from django.contrib import admin

# Register your models here.
from .models import Exercise, Workout

admin.site.register(Exercise)
admin.site.register(Workout)
