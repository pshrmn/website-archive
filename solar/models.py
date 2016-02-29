from django.db import models


class SolarSystem(models.Model):
    name = models.CharField(max_length=100)


class Star(models.Model):
    name = models.CharField(max_length=100)
    radius = models.FloatField()

    solar_system = models.ForeignKey(
        'solar.SolarSystem',
        on_delete=models.CASCADE
    )


class Planet(models.Model):
    name = models.CharField(max_length=100)
    # radius of the planet
    radius = models.FloatField()
    # distance from the sun
    # (distance from center of sun to center of planet is
    # sun.radius + distance + planet.radius)
    distance = models.FloatField()
    # the number of seconds in a day
    day_length = models.IntegerField()
    # orbital period of rotation around the sun in seconds
    orbit = models.IntegerField()

    star = models.ForeignKey(
        'solar.Star',
        on_delete=models.CASCADE
    )


class Moon(models.Model):
    name = models.CharField(max_length=100)
    radius = models.FloatField()
    distance = models.FloatField()
    day_length = models.IntegerField()
    orbit = models.IntegerField()

    planet = models.ForeignKey(
        'solar.Planet',
        on_delete=models.CASCADE
    )
