from porpoiseflow.api import (
    BaseTaskViewSet, UserViewSet as OriginalUserViewSet,
    ProcessDefViewSet as OriginalProcessDefViewSet,
    ProcessViewSet as OriginalProcessViewSet)
from demo import models, serializers

class UserViewSet(OriginalUserViewSet):
    filter_fields = ['username',]

class LoggingViewSet(BaseTaskViewSet):
    get_queryset = models.Logging.objects.all
    serializer_class = serializers.LoggingSerializer


class ChoiceViewSet(BaseTaskViewSet):
    get_queryset = models.Choice.objects.all
    serializer_class = serializers.ChoiceSerializer


class ProcessDefViewSet(OriginalProcessDefViewSet):
    filter_fields = ['process_id',]

class ProcessViewSet(OriginalProcessViewSet):

    def perform_create(self, serializer):
        owner = serializer.validated_data['owner']
        process_def = serializer.validated_data['process_def']

        process = process_def.instantiate(owner, owner)
        process.start(owner)
        serializer.instance = process
        
        super(ProcessViewSet, self).perform_create(serializer)
