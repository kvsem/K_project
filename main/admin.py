from django.contrib import admin
from main.models import Post

# Register your models here.


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # icon = '<i class="material-icons">grid_on</i>'

    list_per_page = 100

    list_display = (
        'title',
        'category',
        'write_date',
        'context',
    )

    list_filter = (
    )

    search_fields = [
    ]

    date_hierarchy = 'write_date'

    readonly_fields = [
        'created_at',
        'updated_at',
    ]

    raw_id_fields = []
    actions = []

    fieldsets = (
        ('포스트 정보', dict(fields=[
            'title',
            'category',
            'write_date',
            'context',
        ])),
    )