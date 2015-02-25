from .base import *
import os
import dj_database_url

# False if environment variable isn't set
DEBUG = os.environ.get('DJANGO_DEBUG', '') == 'True'
TEMPLATE_DEBUG = DEBUG

ADMINS = (('Admin', os.environ['ADMIN_EMAIL']),)

DATABASES['default'] = dj_database_url.config()

SECRET_KEY = os.environ['SECRET_KEY']

STATIC_URL = os.environ['STATIC_URL']


DEFAULT_FROM_EMAIL = os.environ['EMAIL_USER']
EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_HOST_USER = os.environ['EMAIL_USER']
EMAIL_HOST_PASSWORD = os.environ['EMAIL_PWD']
EMAIL_PORT = os.environ['EMAIL_PORT']
EMAIL_USE_TLS = True

SERVER_EMAIL = os.environ['EMAIL_HOST']

ALLOWED_HOSTS = os.environ['ALLOWED_HOSTS'].split(',')
