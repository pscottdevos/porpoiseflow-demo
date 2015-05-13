from django.contrib.auth import get_user_model
from django.views.generic import TemplateView
from django.shortcuts import render

# Create your views here.

class ClientView(TemplateView):

    template_name = 'client.html'

    def get_context_data(self, **kwargs):
        context = super(ClientView, self).get_context_data(**kwargs)
        client_num = kwargs.get('client_num')
        context.update({
            'client_num':client_num,
            'user_id': get_user_model().objects.get(
                username='user{0}'.format(client_num)).id,
            'process_id':kwargs.get('process_id')})
        return context
