from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "My shiny new management command."

    def add_arguments(self, parser):
        parser.add_argument('bpmn_file', nargs=1)

    def handle(self, *args, **options):
        bpmn_file = options['bpmn_file'][0]
