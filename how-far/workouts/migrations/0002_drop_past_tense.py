# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0001_init'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exercise',
            name='past_tense',
        ),
    ]
