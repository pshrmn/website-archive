# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0003_past_tense'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workout',
            name='date',
        ),
        migrations.RemoveField(
            model_name='workout',
            name='time',
        ),
    ]
