"""K_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from django.conf.urls import include
from django.urls import path
from django.views.generic.base import RedirectView
from main.views import main_page, post_view, guide, write, intro, contact

urlpatterns = [
    path('', main_page, name='main'),
    path('summmernote/', include('django_summernote.urls')),

    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('favicon.ico')), name="favicon"),

    path('admin/', admin.site.urls),
    path('guide/', guide, name='guide'),
    path('intro/', intro, name='intro'),
    path('contact/', contact, name='contact'),
    path('view/', post_view, name='view'),
    path('write/', write, name='write.html'),
]

