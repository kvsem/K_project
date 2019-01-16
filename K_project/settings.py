# -*- coding: utf-8 -*-
"""
Django settings for K_project project.

Generated by 'django-admin startproject' using Django 2.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os, json
from django.core.exceptions import ImproperlyConfigured
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static_root')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# secrets.json 파일 위치를 명시

environment_file = os.path.join(BASE_DIR, 'environments.json')

with open(environment_file) as f:
    _environments = json.loads(f.read())


def get_environments(_env, _environments=_environments):
    """
    환경변수 가져오기
    """
    try:
        return _environments[_env]
    except KeyError:
        error_msg = "[ENVIRONMENT_ERROR] {}".format(_env)
        raise ImproperlyConfigured(error_msg)


SECRET_KEY = get_environments('SECRET_KEY')
X_FRAME_OPTIONS = 'ALLOWALL'

XS_SHARING_ALLOWED_METHODS = ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE']
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if os.getenv('IS_DEBUG') == 'True' else False

ALLOWED_HOSTS = get_environments('ALLOWED_HOSTS')


# Application definition
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)


INSTALLED_APPS = [
    'jet',
    'jet.dashboard',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.kakao',
    'main.apps.MainConfig',
    'utils.apps.UtilsConfig',
    'django_summernote',
]

SITE_ID = 1

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'utils.middleware.CustomMiddleware'
]

ROOT_URLCONF = 'K_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATE_DIR],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'K_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': get_environments('MYSQL_HOST'),
        'NAME': get_environments('MYSQL_NAME'),
        'USER': get_environments('MYSQL_USER'),
        'PASSWORD': get_environments('MYSQL_PASSWORD'),
        'PORT': get_environments('MYSQL_PORT'),
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'
USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

MEDIA_ROOT = os.path.join(BASE_DIR, 'static_root/media')

if os.getenv('SERVER_STATUS') == 'LOCAL':
    MEDIA_ROOT = os.path.join(BASE_DIR, 'static/media')

MEDIA_URL = '/static/media/'

SUMMERNOTE_CONFIG = {
    'iframe': True,
    'summernote': {
        # As an example, using Summernote Air-mode
        'airMode': False,

        # Change editor size
        'width': '100%',

        'lang': 'ko-KR',

    },
    # 'css': {
    #     'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.29.0/theme/monokai.min.css',
    # },
    'codemirror': {
        'mode': 'htmlmixed',
        'lineNumbers': 'true',

        # You have to include theme file in 'css' or 'css_for_inplace' before using it.
        'theme': 'monokai',
    },
}

SOCIALACCOUNT_PROVIDERS = {
    'kakao': {
        'SCOPE': [
            'profile',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}

LOGIN_REDIRECT_URL = '/post'
ACCOUNT_LOGOUT_REDIRECT_URL = '/post'
ACCOUNT_SESSION_REMEMBER = True
ACCOUNT_LOGOUT_ON_GET = True

# LOG
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO').upper()
DB_LOG_LEVEL = os.getenv('DB_LOG_LEVEL', 'INFO').upper() if os.getenv('DB_LOG_LEVEL') is not None else LOG_LEVEL
# LOG_HANDLER = ['file']
LOG_HANDLER = ['console'] if DEBUG is True else ['console', 'file']

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(process)06d %(levelname)s %(asctime)s %(module)s:%(lineno)d] %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {
        'console': {
            'level': LOG_LEVEL,
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'null': {
            'class': 'logging.NullHandler',
            'level': 'ERROR',
            'formatter': 'simple',
        },
        'file': {
            'level': LOG_LEVEL,
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'web.log'),
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django': {
            'handlers': LOG_HANDLER,
            'level': LOG_LEVEL,
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': LOG_HANDLER,
            'level': DB_LOG_LEVEL,
            'propagate': False,
        },
        'django.template': {
            'handlers': LOG_HANDLER,
            'level': 'INFO',
            'propagate': False,
        },
        'K.log': {
            'handlers': LOG_HANDLER,
            'level': LOG_LEVEL,
            'propagate': False,
        }
    }
}