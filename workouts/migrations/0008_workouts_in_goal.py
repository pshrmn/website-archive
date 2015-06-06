# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('workouts', '0007_trip_not_distance'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='owner',
            field=models.ForeignKey(default=1, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='workout',
            name='goal',
            field=models.ForeignKey(default=2, to='workouts.Goal'),
            preserve_default=False,
        ),
    ]
