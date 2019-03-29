# Copyright (c) 2017 LINE Corporation
# These sources are released under the terms of the MIT license: see LICENSE

"""
Django settings for promgen project.

Generated by 'django-admin startproject' using Django 1.10.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os
import warnings

import dj_database_url
import raven
import yaml
from django.urls import reverse_lazy

from promgen.plugins import apps_from_setuptools
from promgen.version import __version__

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', '0') != '0'

# Settings for Prometheus paths and such
PROMGEN_CONFIG_DIR = os.environ['PROMGEN_CONFIG_DIR']
PROMGEN_CONFIG = os.environ.get(
    'PROMGEN_CONFIG',
    os.path.join(PROMGEN_CONFIG_DIR, 'promgen.yml')
)
if os.path.exists(PROMGEN_CONFIG):
    with open(PROMGEN_CONFIG) as fp:
        PROMGEN = yaml.safe_load(fp)
else:
    PROMGEN = {}

PROMGEN_DEFAULT_GROUP = 'Default'

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = apps_from_setuptools + [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.sites',
    'django.contrib.staticfiles',
    'social_django',
    'promgen',
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',
]

# We explicitly include debug_toolbar and whitenoise here, but selectively
# remove it below, so that we can more easily control the import order
MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',  # Only enabled for debug
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Used primarily for docker
    'django.middleware.locale.LocaleMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'promgen.middleware.PromgenMiddleware',
]

SOCIAL_AUTH_RAISE_EXCEPTIONS = DEBUG
LOGIN_URL = reverse_lazy('login')
LOGIN_REDIRECT_URL = reverse_lazy('home')
LOGOUT_REDIRECT_URL = reverse_lazy('home')

ROOT_URLCONF = 'promgen.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'promgen.context_processors.settings_in_view',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'promgen.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {'default': dj_database_url.config(
    env='DATABASE_URL',
    default='sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
)}


# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.environ.get(
    'STATIC_ROOT', os.path.expanduser('~/.cache/promgen')
)

SITE_ID = 1

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

if 'SENTRY_DSN' in os.environ:
    INSTALLED_APPS += ['raven.contrib.django.raven_compat']
    try:
        _RELEASE = raven.fetch_git_sha(BASE_DIR)
    except:
        _RELEASE = __version__

    RAVEN_CONFIG = {
        'dsn': os.environ['SENTRY_DSN'],
        'release': _RELEASE,
    }

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'sentry': {
                'level': 'ERROR',
                'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
                'dsn': os.environ['SENTRY_DSN'],
            },
        },
        'loggers': {
            '': {
                'handlers': ['sentry'],
                'level': 'ERROR',
                'propagate': True,
            },
        },
    }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    )
}

# If CELERY_BROKER_URL is set in our environment, then we configure celery as
# expected. If it is not configured, then we set CELERY_TASK_ALWAYS_EAGER to
# force celery to run all tasks in the same process (effectively runs each task
# as a normal function)
if 'CELERY_BROKER_URL' in os.environ:
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL')
else:
    CELERY_TASK_ALWAYS_EAGER = True


try:
    # If whitenoise is not available, we will remove it from our middleware
    import whitenoise.middleware  # NOQA
except ImportError:
    MIDDLEWARE.remove('whitenoise.middleware.WhiteNoiseMiddleware')

try:
    # If debug_toolbar is not available, we will remove it from our middleware
    import debug_toolbar  # NOQA
    INSTALLED_APPS += ['debug_toolbar']
    INTERNAL_IPS = ['127.0.0.1']
except ImportError:
    MIDDLEWARE.remove('debug_toolbar.middleware.DebugToolbarMiddleware')


# Load overrides from PROMGEN to replace Django settings
for k, v in PROMGEN.pop('django', {}).items():
    globals()[k] = v

# If we still don't have a SECRET_KEY set, we can set something random here.
# This is placed at the very bottom to allow SECRET_KEY to be written into the
# config file instead of an environment variable
if not SECRET_KEY:
    warnings.warn('Unset SECRET_KEY setting to random for now')
    # Taken from Django's generation function
    from django.utils.crypto import get_random_string
    SECRET_KEY = get_random_string(50, 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)')
