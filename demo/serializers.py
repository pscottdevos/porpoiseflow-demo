from porpoiseflow.serializers import TaskSerializer
from demo import models


class LoggingSerializer(TaskSerializer):
    class Meta:
        model = models.Logging


class ChoiceSerializer(TaskSerializer):
    class Meta:
        model = models.Choice
