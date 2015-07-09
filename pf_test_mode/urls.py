from logging import getLogger

from colorama import init, Fore
init(autoreset=True)

from django.conf import settings
from django.conf.urls import patterns, include, url

from pf_test_mode.models import capture_database_file
from pf_test_mode.views import reset_test_data

logger = getLogger(__name__)

# first, some alarmism:
print(Fore.RED + "WARNING: THE pf_test_mode APP IS DANGEROUS")
print("DON'T EVER RUN THIS IN PRODUCTION")
print(Fore.RED + "EVER")

logger.warn('pf_test_mode is running! You should NEVER, EVER see this message '
            'in production.')


urlpatterns = [
    # Examples:
    # url(r'^$', 'pf_demo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'reset-test-data$', reset_test_data)
]

# initial setup
capture_database_file()
