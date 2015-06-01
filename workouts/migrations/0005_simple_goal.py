# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0004_simplify_workout'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='goal',
            name='by',
        ),
    ]
