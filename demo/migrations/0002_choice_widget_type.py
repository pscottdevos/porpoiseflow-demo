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
            name='widget_type',
            field=models.CharField(default=b'checkbox', max_length=8, choices=[(b'text', b'text'), (b'checkbox', b'checkbox')]),
        ),
    ]
