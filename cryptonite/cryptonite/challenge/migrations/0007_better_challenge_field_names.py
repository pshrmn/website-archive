# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-20 23:29
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('challenge', '0006_drop_challenge_path'),
    ]

    operations = [
        migrations.RenameField(
            model_name='challenge',
            old_name='encrypted',
            new_name='problem',
        ),
        migrations.RenameField(
            model_name='challenge',
            old_name='decrypted',
            new_name='solution',
        ),
    ]