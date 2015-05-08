from django.conf.urls import patterns, include, url
from porpoiseflow import api
from rest_framework import routers

from demo.api import (
    ProcessViewSet, UserViewSet, LoggingViewSet, ChoiceViewSet,
    ProcessDefViewSet)
from .models import load_process_defs, create_users

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

router.register(
    'transitions', api.TransitionViewSet, base_name='transition')

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
router.register('questionnaires', api.QuestionnaireViewSet,
    base_name='questionnaire')
router.register('answers', api.AnswerViewSet, base_name='answer')
router.register('answer-items', api.AnswerItemViewSet, base_name='answeritem')

# Processes
router.register('processes', ProcessViewSet, base_name='process')
router.register('processes', api.ProcessViewSet, base_name='process')

router.register(
    'process-statuses', api.ProcessStatusViewSet, base_name='processstatus')

# Questionnaire
router.register(
    'questionnaire-defs', api.QuestionnaireDefViewSet,
    base_name='questionnairedef')
router.register('question-defs', api.QuestionDefViewSet,
    base_name='questiondef')
router.register(
    'answer-item-defs', api.AnswerItemDefViewSet, base_name='answeritemdef')
router.register(
    'multiple-choice-question-defs', api.MultipleChoiceQuestionDefViewSet,
    base_name='multiplechoicequestiondef')
router.register(
    'free-text-question-defs', api.FreeTextQuestionDefViewSet,
    base_name='freetextquestiondef')
