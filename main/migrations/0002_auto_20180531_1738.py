# Generated by Django 2.0.5 on 2018-05-31 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True, verbose_name='생성 일시')),
                ('updated_at', models.DateTimeField(auto_now=True, null=True, verbose_name='수정 일시')),
                ('post_type', models.CharField(choices=[('default', '기본'), ('small', '간식')], default='default', max_length=1000, verbose_name='포스트 타입')),
                ('category', models.CharField(blank=True, help_text='200자', max_length=200, null=True, verbose_name='카테고리')),
            ],
            options={
                'db_table': 'category',
                'verbose_name': '카테고리',
                'verbose_name_plural': '카테고리',
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True, verbose_name='생성 일시')),
                ('updated_at', models.DateTimeField(auto_now=True, null=True, verbose_name='수정 일시')),
                ('name', models.CharField(blank=True, help_text='200자', max_length=200, null=True, verbose_name='이름')),
                ('password', models.CharField(blank=True, help_text='200자', max_length=200, null=True, verbose_name='비밀번호')),
                ('comment', models.TextField(blank=True, null=True, verbose_name='내용')),
            ],
            options={
                'db_table': 'comment',
                'verbose_name': '댓글',
                'verbose_name_plural': '댓글',
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True, verbose_name='생성 일시')),
                ('updated_at', models.DateTimeField(auto_now=True, null=True, verbose_name='수정 일시')),
                ('title', models.CharField(blank=True, help_text='200자', max_length=200, null=True, verbose_name='제목')),
                ('sub_title', models.CharField(blank=True, help_text='200자', max_length=200, null=True, verbose_name='부제목')),
                ('write_date', models.DateTimeField(blank=True, null=True, verbose_name='작성일')),
                ('context', models.TextField(blank=True, null=True, verbose_name='내용')),
            ],
            options={
                'db_table': 'post',
                'verbose_name': '포스트',
                'verbose_name_plural': '포스트',
            },
        ),
        migrations.DeleteModel(
            name='Main',
        ),
    ]
