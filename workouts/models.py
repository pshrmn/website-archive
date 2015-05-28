from django.db import models


class Exercise(models.Model):
    name = models.CharField(max_length=50)


class Workout(models.Model):
    exercise = models.ForeignKey(Exercise)
    date = models.DateTimeField('workout date')
    distance = models.FloatField()
    time = models.TimeField()
