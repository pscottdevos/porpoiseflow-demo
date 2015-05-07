from porpoiseflow.api import ProcessViewSet as OriginalProcessViewSet

class ProcessViewSet(OriginalProcessViewSet):

    def perform_create(self, serializer):
        owner = serializer.validated_data['owner']
        process_def = serializer.validated_data['process_def']

        process = process_def.instantiate(owner, owner)
        process.start(owner)
        serializer.instance = process
        
        super(ProcessViewSet, self).perform_create(serializer)
