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
