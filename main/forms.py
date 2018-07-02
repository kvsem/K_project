from django import forms
from django_summernote.widgets import SummernoteWidget

from .models import Post


class PostForm(forms.ModelForm):
     title = forms.CharField(max_length=100, strip=True, required=True, label='제목')
     category = forms.CharField(max_length=100, strip=True, required=True, label='카테고리')
     context = forms.CharField(widget=SummernoteWidget(), label='내용')

     class Meta:
          model = Post
          fields = ('title', 'category', 'post_type', 'context')
