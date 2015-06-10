from django.conf.urls import patterns, include, url
from rest_framework import routers

from porpoiseflow import api

from demo.api import (
    ProcessViewSet, UserViewSet, GroupViewSet, LoggingViewSet, ChoiceViewSet,
    ProcessDefViewSet, TransitionViewSet)
from demo.models import load_process_defs, create_users
from demo.views import ClientView

router = routers.SimpleRouter(trailing_slash=False)

load_process_defs()
create_users()

# Demo
router.register(
    'loggings', LoggingViewSet, base_name='logging')
router.register(
    'choices', ChoiceViewSet, base_name='choice')
router.register(
    'users', UserViewSet, base_name='user')
router.register(
    'groups', GroupViewSet, base_name='group')
router.register(
    'transitions', TransitionViewSet, base_name='transition')


# Defs
router.register(
    'process-defs', ProcessDefViewSet, base_name='processdef')

router.register('node-defs', api.NodeDefViewSet, base_name='nodedef')

router.register(
    'node-def-properties', api.NodeDefPropertyViewSet,
    base_name='nodedefproperty')

router.register(
    'start-node-defs', api.StartNodeDefViewSet, base_name='startnodedef')

router.register('end-node-defs', api.EndNodeDefViewSet, base_name='endnodedef')

router.register(
    'gateway-defs', api.GatewayDefViewSet, base_name='gatewaydef')

router.register(
    'subprocess-defs', api.SubprocessDefViewSet, base_name='subprocessdef')

router.register(
    'task-node-defs', api.TaskNodeDefViewSet, base_name='tasknodedef')

# Nodes
router.register('nodes', api.NodeViewSet, base_name='node')

router.register(
    'start-nodes', api.StartNodeViewSet, base_name='startnode')

router.register(
    'end-nodes', api.EndNodeViewSet, base_name='endnode')

router.register(
    'task-nodes', api.TaskNodeViewSet, base_name='tasknode')

router.register('gateways', api.GatewayViewSet, base_name='gateway')
router.register('subprocesses', api.TaskViewSet, base_name='subprocess')

# Tasks
router.register('tasks', api.TaskViewSet, base_name='task')
# Processes
router.register('processes', ProcessViewSet, base_name='process')

router.register(
    'process-statuses', api.ProcessStatusViewSet, base_name='processstatus')

urlpatterns = [
    # Examples:
    # url(r'^$', 'pf_demo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^(?P<client_num>[0-9])/(?P<process_id>[a-zA-Z0-9_-]+)$',
        ClientView.as_view())
]
