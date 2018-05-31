from django.db import models

# Create your models here.


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
    title = models.CharField(max_length=200, null=True, blank=True, verbose_name='제목', help_text='200자')
    sub_title = models.CharField(max_length=200, null=True, blank=True, verbose_name='부제목', help_text='200자')
    write_date = models.DateTimeField(null=True, blank=True, verbose_name='작성일')
    context = models.TextField(null=True, blank=True, verbose_name='내용')

    class Meta:
        db_table = 'post'
        verbose_name = '포스트'
        verbose_name_plural = verbose_name


class Category(UpdatedAtCreatedAt):
    DEFAULT = 'default'
    SMALL = 'small'

    CHOICES_CATEGORY = (
        (DEFAULT, '기본'),
        (SMALL, '간식'),
    )

    post_type = models.CharField(max_length=1000, default=DEFAULT, choices=CHOICES_CATEGORY, verbose_name='포스트 타입')
    category = models.CharField(max_length=200, null=True, blank=True, verbose_name='카테고리', help_text='200자')

    class Meta:
        db_table = 'category'
        verbose_name = '카테고리'
        verbose_name_plural = verbose_name


class Comment(UpdatedAtCreatedAt):
    name = models.CharField(max_length=200, null=True, blank=True, verbose_name='이름', help_text='200자')
    password = models.CharField(max_length=200, null=True, blank=True, verbose_name='비밀번호', help_text='200자')
    comment = models.TextField(null=True, blank=True, verbose_name='내용')

    class Meta:
        db_table = 'comment'
        verbose_name = '댓글'
        verbose_name_plural = verbose_name
