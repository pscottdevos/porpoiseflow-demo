import os.path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import models

from porpoiseflow.bpmn2 import Bpmn2Handler
from porpoiseflow.loader import load_diagram
from porpoiseflow.models import ProcessDef, Task, task_registry
from porpoiseflow import tests


def load_process_defs():
    handler = Bpmn2Handler(add_groups=True)
    existing_process_defs = ProcessDef.objects.values_list('process_id',
        flat=True)

    for process_id, path in settings.BASE_PROCESS_DEFS:
        if not process_id in existing_process_defs:
            load_diagram(path)


def create_users():
    User = get_user_model()
    for username, group_names in settings.BASE_USERS:
        groups = Group.objects.filter(name__in=group_names)
        user = User.objects.get_or_create(username=username)[0]
        user.groups.add(*groups)


class Logging(Task):
    text = models.CharField(max_length=120, blank=True, null=True)
    widget_type = models.CharField(max_length=4, default='text', choices=(
        ('text', 'text'), ('none', 'none')))

    def save(self, *args, **kwargs):
        print('\033[92mNode name: {0}, actor: {1}, text: {2}\033[0m'.format(
            self.task_node.node_def.name, self.task_node.actor, self.text))
        super(Logging, self).save(*args, **kwargs)
task_registry.register(Logging)


class Choice(Task):
    choices = models.CharField(max_length=120)
    widget_type = models.CharField(max_length=8, default='checkbox', choices=(
        ('text', 'text'), ('checkbox', 'checkbox'), ('button', 'button')
    ))

    def handle_transition(self, transition):
        return transition.name in self.choices.split('//')
task_registry.register(Choice)


class AutocompleteTask(Task):
    autocomplete = True
task_registry.register(AutocompleteTask)
