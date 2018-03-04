# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0003_goal_progress'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='goal',
            options={'ordering': ['-progress']},
        ),
        migrations.AddField(
            model_name='goal',
            name='public',
            field=models.BooleanField(default=False),
        ),
    ]
