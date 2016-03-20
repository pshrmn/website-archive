from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse

from colorfield2.fields import HexColorField

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
        """
        replace spaces with plus signs for prettier urls
        """
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
        return {
            'name': self.name,
            'star': self.star.to_json() if hasattr(self, 'star') else None,
            'planets': [p.to_json() for p in self.planet_set.all()]
        }


class Star(models.Model):

    SPECTRAL_CHOICES = (
        ('O', 'O'),
        ('B', 'B'),
        ('A', 'A'),
        ('F', 'F'),
        ('G', 'G'),
        ('K', 'K'),
        ('M', 'M')
    )

    SUB_SPECTRAL_CHOICES = (
        (0, 0),
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
        (8, 8),
        (9, 9),
    )

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)

    name = models.CharField(max_length=100, validators=[legal_chars])
    spectrum = models.CharField(max_length=1, choices=SPECTRAL_CHOICES, default='G')
    subspectrum = models.PositiveSmallIntegerField(choices=SUB_SPECTRAL_CHOICES, default=2)

    planetarysystem = models.OneToOneField(
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
            'spectrum': self.spectrum,
            'subspectrum': self.subspectrum
        }


class AbstractSatellite(models.Model):

    name = models.CharField(max_length=100, validators=[legal_chars])
    radius = models.IntegerField()
    # distance from the outer edge of the primary to the outer edge
    # of the satellite (distance from center of primary to center of
    # satellite is primary.radius + satellite.distance + satellite.radius)
    distance = models.IntegerField()
    # the number of seconds in a day
    day_length = models.IntegerField()
    # orbital period of rotation around the primary
    orbit = models.FloatField()
    # the general color of the object
    color = HexColorField(default='#abcdef')

    class Meta:
        abstract = True
        ordering = ["distance"]


class Planet(AbstractSatellite):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    planetarysystem = models.ForeignKey(
        'system.PlanetarySystem',
        on_delete=models.CASCADE,
        null=True
    )

    class Meta(AbstractSatellite.Meta):
        unique_together = (('creator', 'planetarysystem', 'name'),)

    def __str__(self):
        return '{} - {}'.format(self.pk, self.name)

    def url_name(self):
        """
        replace spaces with plus signs for prettier urls
        """
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
            'color': self.color,
            'moons': [moon.to_json() for moon in self.moon_set.all()]
        }

    def light_time(self):
        """
        The amount of time it would take light emitted from the primary
        star to reach the planet.
        """
        speed_of_light = 299792458
        distance = self.distance*1000000*1000
        return int(distance / speed_of_light)


class Moon(AbstractSatellite):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    planet = models.ForeignKey(
        'system.Planet',
        on_delete=models.CASCADE
    )

    class Meta(AbstractSatellite.Meta):
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
            'orbit': self.orbit,
            'color': self.color
        }
