# Generated by Django 2.0.6 on 2018-07-02 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_summernote'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='thumbnail',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='Thumenail'),
        ),
    ]
