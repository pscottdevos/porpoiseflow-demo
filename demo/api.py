from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response

from porpoiseflow.api import (
    BaseTaskViewSet, UserViewSet as OriginalUserViewSet,
    GroupViewSet as OriginalGroupViewSet,
    ProcessDefViewSet as OriginalProcessDefViewSet,
    ProcessViewSet as OriginalProcessViewSet,
    TransitionViewSet as OriginalTransitionViewSet,
    NodeDefPropertyViewSet as OriginalNodeDefPropertyViewSet)
from porpoiseflow.models import Process, ProcessDef

from demo import models, serializers


class UserViewSet(OriginalUserViewSet):
    filter_fields = ['username',]


class GroupViewSet(OriginalGroupViewSet):
    filter_fields = ['name',]


class LoggingViewSet(BaseTaskViewSet):
    get_queryset = models.Logging.objects.all
    serializer_class = serializers.LoggingSerializer


class ChoiceViewSet(BaseTaskViewSet):
    get_queryset = models.Choice.objects.all
    serializer_class = serializers.ChoiceSerializer


class ProcessDefViewSet(OriginalProcessDefViewSet):
    filter_fields = ['process_id',]

class ProcessViewSet(OriginalProcessViewSet):

    def create(self, request, *args, **kwargs):
        owner = get_user_model().objects.get(pk=request.data['owner'])
        process_def = ProcessDef.objects.get(pk=request.data['process_def'])
        process = (Process.objects
            .filter(owner=owner, process_def=process_def)
            .delete())
        process = process_def.instantiate(owner, owner)
        process.start(owner)
        serializer = self.serializer_class(process)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TransitionViewSet(OriginalTransitionViewSet):
    filter_fields = ('input',)

class NodeDefPropertyViewSet(OriginalNodeDefPropertyViewSet):
    filter_fields = ('node_def', 'name')
