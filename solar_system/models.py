from django.db import models
from django.conf import settings


class SolarSystem(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    public = models.BooleanField(default=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)


class Star(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100)
    radius = models.FloatField()

    solarsystem = models.ForeignKey(
        'solar_system.SolarSystem',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)


class Planet(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100)
    # radius of the planet
    radius = models.FloatField()
    # distance from the star
    # (distance from center of star to center of planet is
    # star.radius + distance + planet.radius)
    distance = models.FloatField()
    # the number of seconds in a day
    day_length = models.IntegerField()
    # orbital period of rotation around the star in seconds
    orbit = models.IntegerField()

    star = models.ForeignKey(
        'solar_system.Star',
        on_delete=models.CASCADE
    )

    class Meta:
        ordering = ["distance"]

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)


class Moon(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100)
    radius = models.FloatField()
    distance = models.FloatField()
    day_length = models.IntegerField()
    orbit = models.IntegerField()

    class Meta:
        ordering = ["distance"]

    planet = models.ForeignKey(
        'solar_system.Planet',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)
