# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('distances', '0001_init'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('past_tense', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Goal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('length', models.IntegerField()),
                ('complete', models.BooleanField(default=False)),
                ('end', models.ForeignKey(related_name='end', to='distances.Location')),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('start', models.ForeignKey(related_name='start', to='distances.Location')),
            ],
        ),
        migrations.CreateModel(
            name='Workout',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('distance', models.FloatField()),
                ('exercise', models.ForeignKey(to='workouts.Exercise')),
                ('goal', models.ForeignKey(to='workouts.Goal')),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
