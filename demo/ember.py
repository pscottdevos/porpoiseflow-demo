import json

from rest_framework import serializers, parsers
from rest_framework_ember import renderers, utils


class ModelSerializer(serializers.ModelSerializer):

    def get_model_app_label(self):
        return self.Meta.model._meta.app_label



class JSONRenderer(renderers.JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        # pull the app_label off the serializer
        serializer = renderer_context['view'].get_serializer()
        app_label = serializer.get_model_app_label()
        app_label = '{0}/'.format(app_label) if app_label else ''
        
        json_data = super(JSONRenderer, self).render(
            data=data,
            accepted_media_type=accepted_media_type,
            renderer_context=renderer_context)

        data = json.loads(json_data)

        # set the metadata if any
        if 'meta' in data:
            ember_data = {'meta': data.pop('meta')}
        else:
            ember_data = {}

        # Add the app label to the root keys
        for key, value in data.items():
            ember_data['{0}{1}'.format(app_label, key)] = value

        return json.dumps(ember_data)


class JSONParser(parsers.JSONParser):

    def parse(self, stream, media_type=None, parser_context=None):

        # parse the stream
        result = super(JSONParser, self).parse(
            stream=stream,
            media_type=media_type,
            parser_context=parser_context)

        # get the resource name expected by the view
        resource_name = utils.get_resource_name(
            parser_context.get('view', None))

        # look for that resource name in the parsed result
        for key, value in result.items():
            if key.split('/')[-1] == resource_name:
                resource = result.get(key)
                break
        else:
            resource = None
        
        # underscoralize the resource keys and return
        return utils.format_keys(resource, 'underscore')
