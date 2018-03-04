from django.db import models
from django.conf import settings


class Recipe(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=100)
    dish_name = models.CharField(max_length=100, default="")
    restaurant = models.CharField(max_length=100, blank=False)
    visible = models.BooleanField(default=False)
    url = models.URLField()

    class Meta:
        ordering = ['-pk']

    def __unicode__(self):
        return '{}: {}'.format(self.name, self.restaurant)
