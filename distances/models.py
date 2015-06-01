from django.db import models


class Distance(models.Model):
    name = models.CharField(max_length=200)
    length = models.FloatField()

    def __str__(self):
        return "{} ({} miles)".format(self.name, self.length)
