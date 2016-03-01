from .base import *

SECRET_KEY = 'lu^08=+6-i8w86zm0u2wt-!_q=nmct)#prjudtk+^$xjk1o=#2'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'solar_system',
        'USER': 'galileo',
        'PASSWORD': 'telescope',
        'HOST': '',
        'PORT': '5432',
    }
}
