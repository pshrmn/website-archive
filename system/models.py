from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse

from .validators import legal_chars


class PlanetarySystem(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    public = models.BooleanField(default=True)
    name = models.CharField(max_length=100, validators=[legal_chars])

    class Meta:
        unique_together = (('creator', 'name'),)

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def url_name(self):
        return self.name.replace(' ', '+')

    def get_absolute_url(self):
        return reverse(
            'system',
            kwargs={
                'system_name': self.url_name(),
                'username': self.creator.username
            }
        )

    def to_json(self):
        star = self.star_set.first()
        planets = self.planet_set.all()
        return {
            'name': self.name,
            'star': star.to_json() if star else [],
            'planets': [p.to_json() for p in planets]
        }


class Star(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100, validators=[legal_chars])
    radius = models.IntegerField()

    planetarysystem = models.ForeignKey(
        'system.PlanetarySystem',
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (('creator', 'planetarysystem', 'name'),)

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def to_json(self):
        return {
            'name': self.name,
            'radius': self.radius
        }


class Planet(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100, validators=[legal_chars])
    # radius of the planet
    radius = models.IntegerField()
    # distance from the center of the planetary system
    # (distance from center of star to center of planet is
    # star.radius + distance + planet.radius)
    distance = models.IntegerField()
    # the number of seconds in a day
    day_length = models.IntegerField()
    # orbital period of rotation around the center of the system in days
    orbit = models.FloatField()

    planetarysystem = models.ForeignKey(
        'system.PlanetarySystem',
        on_delete=models.CASCADE,
        null=True
    )

    class Meta:
        ordering = ["distance"]
        unique_together = (('creator', 'planetarysystem', 'name'),)

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def url_name(self):
        return self.name.replace(' ', '+')

    def get_absolute_url(self):
        return reverse(
            'planet',
            kwargs={
                'system_name': self.planetarysystem.url_name(),
                'username': self.creator.username,
                'planet_name': self.url_name()
            }
        )

    def to_json(self):
        return {
            'name': self.name,
            'radius': self.radius,
            'distance': self.distance,
            'day_length': self.day_length,
            'orbit': self.orbit,
            'moons': [moon.to_json() for moon in self.moon_set.all()]
        }

    def light_time(self):
        speed_of_light = 299792458
        distance = self.distance*1000000*1000
        return distance / speed_of_light


class Moon(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100, validators=[legal_chars])
    radius = models.IntegerField()
    distance = models.IntegerField()
    day_length = models.IntegerField()
    orbit = models.FloatField()

    planet = models.ForeignKey(
        'system.Planet',
        on_delete=models.CASCADE
    )

    class Meta:
        ordering = ["distance"]
        unique_together = (('creator', 'planet', 'name'),)

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def url_name(self):
        return self.name.replace(' ', '+')

    def to_json(self):
        return {
            'name': self.name,
            'radius': self.radius,
            'distance': self.distance,
            'day_length': self.day_length,
            'orbit': self.orbit
        }
