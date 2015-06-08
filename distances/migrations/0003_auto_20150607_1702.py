# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('distances', '0002_add_trip'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='trip',
            options={'ordering': ['length']},
        ),
        migrations.RemoveField(
            model_name='trip',
            name='end',
        ),
        migrations.RemoveField(
            model_name='trip',
            name='start',
        ),
        migrations.AddField(
            model_name='trip',
            name='one',
            field=models.ForeignKey(default=1, related_name='one', to='distances.Location'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='trip',
            name='two',
            field=models.ForeignKey(default=2, related_name='two', to='distances.Location'),
            preserve_default=False,
        ),
    ]
