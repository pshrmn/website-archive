# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0004_goal_public'),
    ]

    operations = [
        migrations.AddField(
            model_name='workout',
            name='date',
            field=models.DateField(default=datetime.datetime(2015, 6, 25, 22, 50, 23, 876788), auto_now_add=True),
            preserve_default=False,
        ),
    ]
