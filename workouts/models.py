from django.db import models
from django.conf import settings


class Exercise(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Workout(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    exercise = models.ForeignKey(Exercise)
    date = models.DateTimeField('workout date')
    distance = models.FloatField()
    time = models.TimeField()

    def __str__(self):
        return "{} miles on {}".format(self.distance, self.date)
