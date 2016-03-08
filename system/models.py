from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse


class PlanetarySystem(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    public = models.BooleanField(default=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def get_absolute_url(self):
        return reverse('system', kwargs={'pk': self.pk})

    def to_json(self):
        star = self.star_set.first()
        return {
            'name': self.name,
            'star': star.to_json() if star else []
        }


class Star(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100)
    radius = models.IntegerField()

    planetarysystem = models.ForeignKey(
        'system.PlanetarySystem',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def to_json(self):
        return {
            'name': self.name,
            'radius': self.radius,
            'planets': [planet.to_json() for planet in self.planet_set.all()]
        }


class Planet(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100)
    # radius of the planet
    radius = models.IntegerField()
    # distance from the star
    # (distance from center of star to center of planet is
    # star.radius + distance + planet.radius)
    distance = models.IntegerField()
    # the number of seconds in a day
    day_length = models.IntegerField()
    # orbital period of rotation around the star in days
    orbit = models.FloatField()

    star = models.ForeignKey(
        'system.Star',
        on_delete=models.CASCADE
    )

    class Meta:
        ordering = ["distance"]

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def get_absolute_url(self):
        return reverse('planet', kwargs={'pk': self.pk})

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

    name = models.CharField(max_length=100)
    radius = models.IntegerField()
    distance = models.IntegerField()
    day_length = models.IntegerField()
    orbit = models.FloatField()

    class Meta:
        ordering = ["distance"]

    planet = models.ForeignKey(
        'system.Planet',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def to_json(self):
        return {
            'name': self.name,
            'radius': self.radius,
            'distance': self.distance,
            'day_length': self.day_length,
            'orbit': self.orbit
        }
