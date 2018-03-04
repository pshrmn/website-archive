from .base import *
import os
import dj_database_url

# False if environment variable isn't set
DEBUG = os.environ.get('DJANGO_DEBUG', '') == 'True'
TEMPLATE_DEBUG = DEBUG

ADMINS = (('Admin', os.environ['ADMIN_EMAIL']),)

DATABASES['default'] = dj_database_url.config()
SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS = ['*']  # os.environ['ALLOWED_HOSTS'].split(',')
