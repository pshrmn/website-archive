# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('distances', '0001_initial_distances'),
        ('workouts', '0001_initial_workouts'),
    ]

    operations = [
        migrations.CreateModel(
            name='Goal',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('by', models.DateTimeField(blank=True, verbose_name='complete by', null=True)),
                ('distance', models.ForeignKey(to='distances.Distance')),
                ('exercise', models.ForeignKey(blank=True, to='workouts.Exercise', null=True)),
            ],
        ),
    ]
