from django.db import models
from django.conf import settings

from distances.models import Trip


class Exercise(models.Model):
    name = models.CharField(max_length=50)
    past_tense = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Workout(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    exercise = models.ForeignKey(Exercise)
    distance = models.FloatField()

    def __str__(self):
        return '{} miles'.format(self.distance)


class Goal(models.Model):
    trip = models.ForeignKey(Trip)
    exercise = models.ForeignKey(Exercise, blank=True, null=True)

    def __str__(self):
        return "Goal of: {}".format(self.trip)
