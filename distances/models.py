from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=8, decimal_places=4)
    longitude = models.DecimalField(max_digits=8, decimal_places=4)

    def __str__(self):
        return self.name


class Trip(models.Model):
    start = models.ForeignKey(Location, related_name='start')
    end = models.ForeignKey(Location, related_name='end')
    length = models.FloatField()

    class Meta:
        ordering = ['length']

    def __str__(self):
        return '{} to {} ({} miles)'.format(self.start, self.end, self.length)
