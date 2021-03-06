# Generated by Django 2.0.5 on 2018-06-07 03:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_post_img_file'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Category',
        ),
        migrations.RemoveField(
            model_name='post',
            name='sub_title',
        ),
        migrations.AddField(
            model_name='post',
            name='category',
            field=models.CharField(blank=True, help_text='200자', max_length=200, null=True, verbose_name='카테고리'),
        ),
        migrations.AddField(
            model_name='post',
            name='post_type',
            field=models.CharField(choices=[('default', '기본'), ('small', '간식')], default='default', max_length=1000, verbose_name='포스트 타입'),
        ),
    ]
