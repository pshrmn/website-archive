import os
import dj_database_url

from .base import *

# False if environment variable isn't set
DEBUG = os.environ.get('DJANGO_DEBUG', '') == 'True'

ADMINS = (('Admin', os.environ['ADMIN_EMAIL']),)

DATABASES['default'] = dj_database_url.config()
SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS = ['*']
