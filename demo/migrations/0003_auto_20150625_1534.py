# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('porpoiseflow', '0006_auto_20150617_1032'),
        ('demo', '0003_auto_20150625_1612'),
    ]

    operations = [
        migrations.CreateModel(
            name='AutocompleteTask',
            fields=[
                ('task_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='porpoiseflow.Task')),
            ],
            bases=('porpoiseflow.task',),
        ),
    ]
