from django.shortcuts import render
from main.models import Post


def main_page(request):
    post_list = Post.objects.order_by('-write_date').values()

    contents_list = dict(
        post_data=post_list
    )
    return render(request, 'main/main.html', dict(contents_list=contents_list))


def post_view(request):
    post_id = request.GET.get('id')

    post = Post.objects.filter(id=post_id).values().last()

    return render(request, 'main/view.html', dict(post=post))


def write(request):
    return render(request, 'main/write.html')


def guide(request):
    return render(request, 'base/write_guide.html')

