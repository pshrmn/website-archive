# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('distances', '0003_auto_20150607_1702'),
        ('workouts', '0008_workouts_in_goal'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='goal',
            name='exercise',
        ),
        migrations.RemoveField(
            model_name='goal',
            name='trip',
        ),
        migrations.AddField(
            model_name='goal',
            name='end',
            field=models.ForeignKey(related_name='end', to='distances.Location', default=2),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='goal',
            name='length',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='goal',
            name='start',
            field=models.ForeignKey(related_name='start', to='distances.Location', default=1),
            preserve_default=False,
        ),
    ]
