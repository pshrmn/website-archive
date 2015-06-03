# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0006_add_trip'),
    ]

    operations = [
        migrations.RenameField(
            model_name='goal',
            old_name='distance',
            new_name='trip',
        ),
    ]
