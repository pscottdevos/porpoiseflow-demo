from logging import getLogger
from shutil import copyfile

from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotAllowed

logger = getLogger(__name__)

# Create your views here.

def reset_test_data(request):
    if request.method == 'POST':
        logger.info('restoring database')
        copyfile(settings.TEST_MODE_DB_TEMPFILE, settings.TEST_MODE_DB_FILE)
        return HttpResponse()

    return HttpResponseNotAllowed()
