import json
import requests

from django.core.management.base import BaseCommand

SERVER = 'http://localhost:8000'

def patherize(class_name):
    from inflection import dasherize, pluralize, underscore
    return '/api/' + dasherize(pluralize(underscore(class_name)))

class Command(BaseCommand):
    help = "Run the demo client"

    def add_arguments(self, parser):
        parser.add_argument('username', nargs=1)
        parser.add_argument('process_id', nargs='?')

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
            response = self.put(path + '/' + data['id'], data)
        else:
            response = self.post(path, data)
        return response

    def handle(self, *args, **options):
        username = options['username'][0]
        process_id = options['process_id'][0] if options['process_id'] else None

        user = self.get('/api/users', {'username':username})[0]
        user_id = user['id']

        getattr(self, 'handle_' + username)(user_id, process_id)


    def handle_user1(self, user_id, process_id):
        process_def = self.get(
            '/api/process-defs', {'process_id':process_id})[0]
        process_def_id = process_def['id']

        process = self.post(
            '/api/processes', {'owner':user_id, 'process_def':process_def_id})

        while True:
            # get the next node
            node = self.get('/api/nodes', {'next_for_actor':user_id})

            # If process ends, see if we should start another
            if not node:
                print 'End of Process.'
                user_input = raw_input('Start Another? Y/(N) ')
                if user_input.lower().startswith('y'):
                    process = self.post(
                        '/api/processes',
                        {'owner':user_id, 'process_def':process_def_id})
                    continue
                break
            node = node[0]
            node = self.recast(node)
            node_subclass = node['subclass']

            if node_subclass == 'Gateway':
                if self.ask_exit_on_gateway(node):
                    print 'Exiting Client'
                    return

            elif node_subclass == 'TaskNode':
                task = self.get_task(node)
                task_class = node['task_class']
                data = getattr(self, 'do_'+task_class)(task)
                self.save(patherize(task_class), data)
        print "Process is complete"

    def handle_user2(self, user_id, process_id):
        while True:
            # get the list of available nodes
            nodes = self.get('/api/nodes', {'available_for_actor':user_id})
            if nodes:
                recast_nodes = []

                print '0. Exit Client'
                i = 1
                for node in nodes:
                    node = self.recast(node)
                    node_subclass = node['subclass']
                    if node_subclass == 'TaskNode':
                        recast_nodes.append(node)
                        node_def = self.get_node_def(node)
                        print '{0}. pk{1} {2}'.format(
                            i, node['id'], node_def['name'])
                        i += 1
                while True:
                    try:
                        choice = int(raw_input('Select a node: '))
                        if choice not in range(len(nodes)+1):
                            raise ValueError
                        break
                    except ValueError:
                        print 'Please type a number from the list.'
                if not choice:
                    return
                node = recast_nodes[choice]
                task = get_task(node)
                task_class = node['task_class']
                data = getattr(self, 'do_'+task_class)(task)
                self.save(patherize(task_class), data)
            else:
                print 'No tasks are available'
                user_input = raw_input('Continue? (Y)/N ')
                if user_input.lower().startswith('n'):
                    return

    def ask_exit_on_gateway(self, node):
        node_def = self.get_node_def(node)
        print 'Gateway: %s' % node_def['description']
        user_input = raw_input('Continue? (Y)/N) ')
        return user_input.lower().startswith('n')

    def get_node_def(self, node):
        return self.get(
            '/api/node-defs/' + str(node['node_def']))
            
    def get_task(self, node):
        # get the task associated with the node
        task_class = node['task_class']
        task_path = patherize(task_class)
        task= self.get(task_path, {'task_node':node['id']})
        if task:
            task= task[0]
        else:
            task= {'task_node':node['id']}
        return task

    def recast(self, node):
        node_id = node['id']
        node_subclass = node['subclass']
        node_path = patherize(node_subclass)
        node = self.get(node_path + '/' + str(node_id))
        return node

    def get(self, path, params=None):
        url = SERVER + path
        headers = {'Accept': 'application/json'}
        response = requests.get(url, params=params)
        return json.loads(response.content)

    def post(self, path, data):
        url = SERVER + path
        headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
        response = requests.post(url, data=json.dumps(data), headers=headers)
        return json.loads(response.content)

    def put(self, path, data):
        url = SERVER + path
        headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
        response = requests.put(url, data=json.dumps(data), headers=headers)
        return json.loads(response.content)
