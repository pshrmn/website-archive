from django.contrib import admin

# Register your models here.
from .models import Exercise, Workout, Goal

admin.site.register(Exercise)
admin.site.register(Workout)
admin.site.register(Goal)
