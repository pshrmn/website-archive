from django.db import models
from django.conf import settings

from distances.models import Distance


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
    distance = models.ForeignKey(Distance)
    exercise = models.ForeignKey(Exercise, blank=True, null=True)

    def __str__(self):
        return "Goal of: {}".format(self.distance)
