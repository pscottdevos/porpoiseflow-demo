# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('demo', '0003_auto_20150625_1534'),
    ]

    operations = [
        migrations.AddField(
            model_name='logging',
            name='widget_type',
            field=models.CharField(default=b'text', max_length=4, choices=[(b'text', b'text'), (b'none', b'none')]),
        ),
        migrations.AlterField(
            model_name='logging',
            name='text',
            field=models.CharField(max_length=120, null=True, blank=True),
        ),
    ]
