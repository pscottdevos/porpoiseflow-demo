from porpoiseflow.api import BaseTaskViewSet
from demo import models, serializers


class LoggingViewSet(BaseTaskViewSet):
    get_queryset = models.Logging.objects.all
    serializer_class = serializers.LoggingSerializer


class ChoiceViewSet(BaseTaskViewSet):
    get_queryset = models.Choice.objects.all
    serializer_class = serializers.ChoiceSerializer
