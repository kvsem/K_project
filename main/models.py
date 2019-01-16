import os
from django.db import models
from django_summernote import models as summer_model
from django_summernote import fields as summer_fields
from django.contrib.auth.models import User
from common import constant
# Create your models here.


class SummerNote(summer_model.Attachment):
    summer_field = summer_fields.SummernoteTextField(default='')


class CreatedAt(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=True, verbose_name='생성 일시')

    class Meta:
        abstract = True
        managed = False
        verbose_name = "생성일시"


class UpdatedAt(models.Model):
    updated_at = models.DateTimeField(auto_now=True, null=True, verbose_name='수정 일시')

    class Meta:
        abstract = True
        managed = False
        verbose_name = "수정일시"


class DeletedAt(models.Model):
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='삭제 일시')
    is_deleted = models.BooleanField(db_index=True, default=False, verbose_name='삭제 여부')

    class Meta:
        abstract = True
        managed = False
        verbose_name = "삭제일시"


class UpdatedAtCreatedAt(CreatedAt, UpdatedAt):
    class Meta:
        abstract = True
        managed = False


class Post(UpdatedAtCreatedAt):
    DEFAULT = 'DEFAULT'
    SERVER = 'SERVER'
    PYTHON = 'PYTHON'
    DJANGO = 'DJANGO'
    JAVA = 'JAVA'
    SPRING = 'SPRING'
    FRONT = 'FRONT'
    DATABASE = 'DATABASE'
    WEB = 'WEB'
    ELASTICSEARCH = 'ELASTIC SEARCH'

    CHOICES_CATEGORY = (
        (DEFAULT, 'DEFAULT'),
        (SERVER, 'SERVER'),
        (PYTHON, 'PYTHON'),
        (DJANGO, 'DJANGO'),
        (JAVA, 'JAVA'),
        (SPRING, 'SPRING'),
        (FRONT, 'FRONT'),
        (DATABASE, 'DATABASE'),
        (WEB, 'WEB'),
        (ELASTICSEARCH, 'ELASTIC SEARCH'),
    )

    @property
    def thumbnail(self):
        if self.category.lower() == self.DEFAULT.lower():
            return os.path.join(constant.IMAGE_PATH, 'default.jpeg')
        elif self.category.lower() == self.SERVER.lower():
            return os.path.join(constant.IMAGE_PATH, 'ubuntu.png')
        elif self.category.lower() == self.PYTHON.lower():
            return os.path.join(constant.IMAGE_PATH, 'python.png')
        elif self.category.lower() == self.DJANGO.lower():
            return os.path.join(constant.IMAGE_PATH, 'django.png')
        elif self.category.lower() == self.JAVA.lower():
            return os.path.join(constant.IMAGE_PATH, 'java.png')
        elif self.category.lower() == self.SPRING.lower():
            return os.path.join(constant.IMAGE_PATH, 'spring.png')
        elif self.category.lower() == self.FRONT.lower():
            return os.path.join(constant.IMAGE_PATH, 'front.png')
        elif self.category.lower() == self.DATABASE.lower():
            return os.path.join(constant.IMAGE_PATH, 'mysql.jpeg')
        elif self.category.lower() == self.WEB.lower():
            return os.path.join(constant.IMAGE_PATH, 'web.png')
        elif self.category.lower() == self.ELASTICSEARCH.lower():
            return os.path.join(constant.IMAGE_PATH, 'elastic.png')

    def get_thumbnail(self, category):
        if category.lower() == self.DEFAULT.lower():
            return os.path.join(constant.IMAGE_PATH, 'default.png')
        elif category.lower() == self.SERVER.lower():
            return os.path.join(constant.IMAGE_PATH, 'ubuntu.png')
        elif category.lower() == self.PYTHON.lower():
            return os.path.join(constant.IMAGE_PATH, 'python.png')
        elif category.lower() == self.DJANGO.lower():
            return os.path.join(constant.IMAGE_PATH, 'django.png')
        elif category.lower() == self.JAVA.lower():
            return os.path.join(constant.IMAGE_PATH, 'java.png')
        elif category.lower() == self.SPRING.lower():
            return os.path.join(constant.IMAGE_PATH, 'spring.png')
        elif category.lower() == self.FRONT.lower():
            return os.path.join(constant.IMAGE_PATH, 'front.png')
        elif category.lower() == self.DATABASE.lower():
            return os.path.join(constant.IMAGE_PATH, 'mysql.jpeg')
        elif category.lower() == self.WEB.lower():
            return os.path.join(constant.IMAGE_PATH, 'web.png')
        elif category.lower() == self.ELASTICSEARCH.lower():
            return os.path.join(constant.IMAGE_PATH, 'elastic.png')

    title = models.CharField(max_length=200, null=True, blank=True, verbose_name='제목')
    category = models.CharField(max_length=200, null=True, blank=True, choices=CHOICES_CATEGORY, verbose_name='카테고리')
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.DO_NOTHING, db_constraint=False)
    write_date = models.DateTimeField(null=True, blank=True, verbose_name='작성일')
    context = models.TextField(null=True, blank=True, verbose_name='내용')
    like = models.IntegerField(null=False, blank=False, default=0, verbose_name='좋아요')

    class Meta:
        db_table = 'post'
        verbose_name = '포스트'
        verbose_name_plural = verbose_name


class Comment(UpdatedAtCreatedAt):
    post = models.ForeignKey(Post, null=True, blank=True, on_delete=models.DO_NOTHING, db_constraint=False)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.DO_NOTHING, db_constraint=False)
    comment = models.TextField(null=True, blank=True, verbose_name='내용')

    class Meta:
        db_table = 'comment'
        verbose_name = '댓글'
        verbose_name_plural = verbose_name


class Game(UpdatedAtCreatedAt):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.DO_NOTHING, db_constraint=False)
    score = models.IntegerField(null=False, blank=False, default=0, verbose_name='점수')

    class Meta:
        db_table = 'game'
        verbose_name = '게임'
        verbose_name_plural = verbose_name
