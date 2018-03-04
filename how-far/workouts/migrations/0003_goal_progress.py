# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0002_drop_past_tense'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='progress',
            field=models.FloatField(default=0),
        ),
    ]
