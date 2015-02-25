from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(template_name="home.html"), name="home"),
    url(r'^recipes/', include('recipes.urls')),
)

urlpatterns += patterns(
    '',
    url(r'^admin/', include(admin.site.urls), name='admin'),
)

if not settings.DEBUG:
    urlpatterns += patterns(
        '',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_ROOT}),
    )
