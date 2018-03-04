"""
Test settings and globals which allows us to run our test
suite locally.
"""

from .base import *

TEMPLATE_DIRS = (
    normpath(join(SITE_ROOT, 'registration/templates')),
    normpath(join(SITE_ROOT, 'templates')),
)

SECRET_KEY="thiskeyisntverysecretandshouldntbeusedforanythingbesidestestingtheregistrationapp"

# TEST SETTINGS
TEST_RUNNER = 'discover_runner.DiscoverRunner'
TEST_DISCOVER_TOP_LEVEL = SITE_ROOT
TEST_DISCOVER_ROOT = SITE_ROOT
TEST_DISCOVER_PATTERN = "test*.py"

# IN-MEMORY TEST DATABASE
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
        "USER": "",
        "PASSWORD": "",
        "HOST": "",
        "PORT": "",
    },
}

REGISTRATION_OPEN = True

DEBUG = True
