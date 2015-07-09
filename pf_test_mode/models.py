import atexit
from logging import getLogger
import os
from shutil import copyfile

from django.conf import settings
from django.db import models

from porpoiseflow.bpmn2 import Bpmn2Handler

logger = getLogger(__name__)

def capture_database_file():
    logger.info('Backing up sqlite database (this should only happen once)')
    copyfile(settings.TEST_MODE_DB_FILE, settings.TEST_MODE_DB_TEMPFILE)

    # make sure we clean up the temp file when the server shuts down:
    atexit.register(lambda: os.remove(settings.TEST_MODE_DB_TEMPFILE))
