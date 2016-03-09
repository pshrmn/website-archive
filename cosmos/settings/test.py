import os

from .base import *

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

SECRET_KEY = os.environ['SECRET_KEY']
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']

# test settings
TEST_RUNNER = 'discover_runner.DiscoverRunner'
TEST_DISCOVER_TOP_LEVEL = BASE_DIR
TEST_DISCOVER_ROOT = BASE_DIR
TEST_DISCOVER_PATTERN = "test*.py"


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cosmos',
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': '',
        'PORT': '5432',
        'TEST': {
            'NAME': 'cosmos_test_database'
        }
    }
}
