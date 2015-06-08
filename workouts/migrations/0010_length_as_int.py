# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0009_auto_20150607_1703'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='length',
            field=models.IntegerField(),
        ),
    ]
