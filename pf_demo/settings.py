"""
Django settings for pf_demo project.

Generated by 'django-admin startproject' using Django 1.8.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import porpoiseflow

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PFLOW_TESTS_DIR = os.path.join(os.path.dirname(porpoiseflow.__file__), 'tests')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 's3b*kq=uv4@urdwjo%&hzqdxs_8@ufr2hvayyqi^xkee)y!k59'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
DEBUG_PROPAGATE_EXCEPTIONS = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_extensions',
    'rest_framework',
    'porpoiseflow',
    'questionnaire',

    'demo',
    'pf_test_mode'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'pf_demo.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pf_demo.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'



REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'demo.ember.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework_xml.parsers.XMLParser',
        'rest_framework_yaml.parsers.YAMLParser',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'demo.ember.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
        'rest_framework_xml.renderers.XMLRenderer',
        'rest_framework_yaml.renderers.YAMLRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',),
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',)
}
REST_EMBER_FORMAT_KEYS = True
REST_EMBER_PLURALIZE_KEYS = True
PORPOISEFLOW_BASE_REST_SERIALIZER = (
    'demo.ember.ModelSerializer')
APPEND_SLASH = False


#enables or disables the processes for the 
DEMO_MODE = True

# these defs/users will be loaded at startup if they're not already in the
# database
BASE_PROCESS_DEFS = [
    ('sequence_pattern', 'patterns/sequence-pattern.bpmn'),
    ('parallel_split_synchronization',
        'patterns/parallel-split-synchronization.bpmn'),
    ('exclusive_choice_simple_merge',
        'patterns/exclusive-choice-simple-merge.bpmn'),
    ('multi_choice', 'patterns/multichoice.bpmn'),
    ('sequence_change_lanes', 'patterns/sequence-change-lanes.bpmn'),
    ('subprocess_pattern', 'patterns/subprocess.bpmn'),
    ('loop_2', 'patterns/loop2-multi-instance.bpmn'),
    ('nested_branches', 'patterns/nested-branches1.bpmn'),
]

BASE_USERS = [
    ('user1', ['Group 1', 'System']),
    ('user2', ['Group 2', 'TeamLead']),
    ('user3', ['Group 2', 'Employee'])
]

DEMO_PROCESS_DEFS = [
    ('onesykes_maestro', 'onesykes-maestro.bpmn'),
    ('work_history', 'work-history.bpmn'),
    ('demo', 'demo.bpmn'),
]

if DEMO_MODE:
    BASE_PROCESS_DEFS += DEMO_PROCESS_DEFS


if 'pf_test_mode' in INSTALLED_APPS:
    TEST_MODE_DB_FILE = os.path.join(BASE_DIR, 'test_db.sqlite3')
    TEST_MODE_DB_TEMPFILE = os.path.join(BASE_DIR, 'test_db.sqlite3__TEMP')

    DATABASES['default']['NAME'] = TEST_MODE_DB_FILE
