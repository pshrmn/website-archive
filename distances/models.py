from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=8, decimal_places=4)
    longitude = models.DecimalField(max_digits=8, decimal_places=4)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
