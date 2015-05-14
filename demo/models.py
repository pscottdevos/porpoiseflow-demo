import os.path

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import models

from porpoiseflow.bpmn2 import Bpmn2Handler
from porpoiseflow.models import ProcessDef, Task, task_registry
from porpoiseflow.tests import patterns


PROCESSES = [
    ('sequence_pattern', 'sequence-pattern.bpmn'),
    ('parallel_split_synchronization', 'parallel-split-synchronization.bpmn'),
    ('exclusive_choice_simple_merge', 'exclusive-choice-simple-merge.bpmn'),
    ('multi_choice', 'multichoice.bpmn'),
]

USERS = [
    ('user1', 'Group 1'),
    ('user2', 'Group 2')
]

def load_process_defs():
    handler = Bpmn2Handler(add_groups=True)
    existing_process_defs = ProcessDef.objects.values_list('process_id',
        flat=True)
    for process_id, filename in PROCESSES:
        if not process_id in existing_process_defs:
            print process_id
            pattern_dir = os.path.dirname(patterns.__file__)
            handler.parse(os.path.join(pattern_dir, filename))


def create_users():
    User = get_user_model()
    for username, group_name in USERS:
        group = Group.objects.get(name=group_name)
        user = User.objects.get_or_create(username=username)[0]

        user.groups.add(group)


class Logging(Task):
    text = models.CharField(max_length=120)

    def save(self, *args, **kwargs):
        print('\033[92mNode name: {0}, actor: {1}, text: {2}\033[0m'.format(
            self.task_node.node_def.name, self.task_node.actor, self.text))
        super(Logging, self).save(*args, **kwargs)
task_registry.register(Logging)


class Choice(Task):
    choices = models.CharField(max_length=120)

    def handle_transition(self, transition):
        return transition.name in self.choices.split()
task_registry.register(Choice)
