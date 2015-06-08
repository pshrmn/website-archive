# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('distances', '0003_auto_20150607_1702'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trip',
            name='one',
        ),
        migrations.RemoveField(
            model_name='trip',
            name='two',
        ),
        migrations.DeleteModel(
            name='Trip',
        ),
    ]
