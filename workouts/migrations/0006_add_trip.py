# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0005_simple_goal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='distance',
            field=models.ForeignKey(to='distances.Trip'),
        ),
    ]
