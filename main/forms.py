from django_summernote.widgets import SummernoteWidget, SummernoteInplaceWidget
from django import forms
from django_summernote import fields as summer_fields
from .models import SummerNote, Post

class PostForm(forms.ModelForm):
     fields = summer_fields.SummernoteTextFormField(error_messages={'required':(u'데이터를 입력해주세요'),})
     class Meta:
          model = Post
          fields = ('title','category','post_type','context',)
          widgets= {
               'context' : SummernoteWidget(),
          }
