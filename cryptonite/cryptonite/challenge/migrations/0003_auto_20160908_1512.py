# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-08 20:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('challenge', '0002_auto_20160908_1230'),
    ]

    operations = [
        migrations.AlterField(
            model_name='challenge',
            name='path',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='challenge.Path'),
        ),
    ]