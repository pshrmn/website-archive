from django.db import models
from django.conf import settings

from distances.models import Location


class Exercise(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Goal(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    start = models.ForeignKey(Location, related_name='start')
    end = models.ForeignKey(Location, related_name='end')
    length = models.IntegerField()
    progress = models.FloatField(default=0)
    complete = models.BooleanField(default=False)

    def __str__(self):
        return "{} - {} to {}".format(self.pk, self.start, self.end)


class Workout(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    exercise = models.ForeignKey(Exercise)
    distance = models.FloatField()
    goal = models.ForeignKey(Goal)

    def __str__(self):
        return '{} miles'.format(self.distance)
