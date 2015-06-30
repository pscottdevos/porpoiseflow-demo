from django.contrib.auth import get_user_model
from django.views.generic import TemplateView
from django.shortcuts import render

from demo.models import USERS

# Create your views here.

class ClientView(TemplateView):

    template_name = 'client.html'

    def get_context_data(self, **kwargs):
        context = super(ClientView, self).get_context_data(**kwargs)
        client_num = kwargs.get('client_num')
        client_list = range(1, len(USERS)+1)
        context.update({
            'is_client1': client_num == '1',
            'is_client2': client_num >= '2',
            'client_num': client_num,
            'client_nums': client_list,
            'user_id': get_user_model().objects.get(
                username='user{0}'.format(client_num)).id,
            'process_id':kwargs.get('process_id')})
        return context
