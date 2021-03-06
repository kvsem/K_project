# Generated by Django 2.0.6 on 2018-09-03 06:14

import django.contrib.auth.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_post_thumbnail'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='post_type',
        ),
        migrations.AddField(
            model_name='post',
            name='user_id',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name=django.contrib.auth.models.User),
        ),
        migrations.AlterField(
            model_name='post',
            name='category',
            field=models.CharField(blank=True, choices=[('DEFAULT', 'DEFAULT'), ('PYTHON', 'PYTHON'), ('DATABASE', 'DATABASE'), ('WEB', 'WEB'), ('ELASTIC SEARCH', 'ELASTIC SEARCH')], max_length=200, null=True, verbose_name='카테고리'),
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='제목'),
        ),
    ]
