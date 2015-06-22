# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('demo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='choice',
            name='multiple_choice',
            field=models.CharField(default=b'true', max_length=5, blank=True, choices=[(b'true', b'true'), (b'false', b'false')]),
        ),
    ]
