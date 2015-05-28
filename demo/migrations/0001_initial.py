# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('porpoiseflow', '0002_auto_20150528_1717'),
    ]

    operations = [
        migrations.CreateModel(
            name='Choice',
            fields=[
                ('task_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='porpoiseflow.Task')),
                ('choices', models.CharField(max_length=120)),
            ],
            bases=('porpoiseflow.task',),
        ),
        migrations.CreateModel(
            name='Logging',
            fields=[
                ('task_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='porpoiseflow.Task')),
                ('text', models.CharField(max_length=120)),
            ],
            bases=('porpoiseflow.task',),
        ),
    ]
