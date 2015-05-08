import json
import requests

from django.core.management.base import BaseCommand

SERVER = 'http://localhost:8000'

def patherize(class_name):
    from inflection import dasherize, pluralize, underscore
    return '/api/' + dasherize(pluralize(underscore(class_name)))

class Command(BaseCommand):
    help = "My shiny new management command."

    def do_Logging(self, data):
        user_input = raw_input('Enter text to log:')
        data.update({'text':user_input})
        return data

    def do_Choice(self, data):
        user_input = raw_input('Enter transitions to follow:')
        data.update({'choices':user_input})
        return data

    def save(self, path, data):
        if 'id' in data:
            print 'PUT'
            response = self.put(path + '/' + data['id'], data)
        else:
            print 'POST'
            response = self.post(path, data)
        return response.data

    def add_arguments(self, parser):
        parser.add_argument('username', nargs=1)
        parser.add_argument('process_id', nargs=1)

    def handle(self, *args, **options):
        username = options['username'][0]
        process_id = options['process_id'][0]

        user_data = self.get('/api/users', {'username':username})[0]
        user_id = user_data['id']

        process_def_data = self.get(
            '/api/process-defs', {'process_id':process_id})[0]
        process_def_id = process_def_data['id']

        process_data = self.post(
            '/api/processes', {'owner':user_id, 'process_def':process_def_id})

        while True:
            node_data = self.get('/api/nodes', {'next_for_user':user_id})
            if not node_data:
                break
            node_data = node_data[0]
            node_id = node_data['id']
            node_subclass = node_data['subclass']
            node_path = patherize(node_subclass)
            node_data = self.get(node_path + '/' + str(node_id))
            if node_subclass == 'Gateway':
                print 'Gateway: %s' % node_data['description']
            elif node_subclass == 'TaskNode':
                task_class = node_data['task_class']
                task_path = patherize(task_class)
                task_data = self.get(task_path, {'task_node':node_id})
                if task_data:
                    task_data = task_data[0]
                else:
                    task_data = {'task_node':node_id}
                data = getattr(self, 'do_'+task_class)(task_data)
                self.save(task_path, data)

    def get(self, path, params=None):
        url = SERVER + path
        response = requests.get(url, params=params)
        return json.loads(response.content)

    def post(self, path, data):
        url = SERVER + path
        response = requests.post(url, data=data)
        return json.loads(response.content)

    def put(self, path, data):
        url = SERVER + path
        response = requests.put(url, data=data)
        return json.loads(response.content)