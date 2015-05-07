import requests
from django.core.management.base import BaseCommand

SERVER = 'http://localhost:8000'

class Command(BaseCommand):
    help = "My shiny new management command."

    def add_arguments(self, parser):
        parser.add_argument('username', nargs=1)
        parser.add_argument('process_id', nargs=1)

    def handle(self, *args, **options):
        username = options['username'][0]
        process_id = options['process_id'][0]

        self.get('/api/users/', {'username':username})


    def get(self, path, params):
        url = SERVER + path
        response = requests.get(url, params=params)
        print response.content
