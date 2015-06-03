# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0006_add_trip'),
        ('distances', '0001_initial_distances'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('latitude', models.DecimalField(decimal_places=4, max_digits=8)),
                ('longitude', models.DecimalField(decimal_places=4, max_digits=8)),
            ],
        ),
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('length', models.FloatField()),
                ('end', models.ForeignKey(to='distances.Location', related_name='end')),
                ('start', models.ForeignKey(to='distances.Location', related_name='start')),
            ],
        ),
        migrations.DeleteModel(
            name='Distance',
        ),
    ]
