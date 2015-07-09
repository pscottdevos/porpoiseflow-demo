from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin

from demo import urls

urlpatterns = [
    # Examples:
    # url(r'^$', 'pf_demo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(urls.router.urls)),
    url(r'^client/', include(urls)),
]

if 'pf_test_mode' in settings.INSTALLED_APPS:
    from pf_test_mode import urls as test_mode_urls
    urlpatterns += [url(r'^test-mode/', include(test_mode_urls))]
