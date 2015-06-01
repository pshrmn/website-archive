# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0002_add_goals'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='past_tense',
            field=models.CharField(default='exercised', max_length=50),
            preserve_default=False,
        ),
    ]
