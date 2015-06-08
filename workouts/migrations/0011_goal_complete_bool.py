# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0010_length_as_int'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='complete',
            field=models.BooleanField(default=False),
        ),
    ]
