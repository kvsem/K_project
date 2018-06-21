from django.shortcuts import render
from main.models import Post
from main.forms import PostForm

def main_page(request):
    page = int(request.GET.get('page', 0))
    next_page = page+1
    prev_page = page-1 if page != 0 else 0

    start_at = page*3
    end_at = (page+1)*3

    default_post_list = Post.objects.filter(post_type='default').order_by('-write_date').values()[start_at:end_at]

    count = Post.objects.filter(post_type='default').count()
    if count % 3 == 0:
        max_page = count//3-1
    else:
        max_page = count//3

    contents_list = get_side_contents()

    contents_list['default_post_data'] = default_post_list

    pages = dict(
        max_page=max_page,
        page=page,
        next_page=next_page,
        prev_page=prev_page,
    )
    return render(request, 'main/main.html', dict(contents_list=contents_list, pages=pages))


def post_view(request):
    post_id = request.GET.get('id')

    post = Post.objects.filter(id=post_id).values().last()

    return render(request, 'main/view.html', dict(post=post))


def write(request):
    form = PostForm()
    contents_list = get_side_contents()
    return render(request, 'main/write.html', dict(form=form, contents_list=contents_list))


def guide(request):
    return render(request, 'base/write_guide.html')


def intro(request):
    contents_list = get_side_contents()
    return render(request, 'main/intro.html', dict(contents_list=contents_list))


def contact(request):
    contents_list = get_side_contents()
    return render(request, 'main/contact.html', dict(contents_list=contents_list))


def get_side_contents():
    small_post_list = Post.objects.filter(post_type='small').order_by('-write_date').values()[:3]
    all_post_list = Post.objects.order_by('-write_date').values()[:5]
    contents_list = dict(
        small_post_data=small_post_list,
        all_post_list=all_post_list,
    )

    return contents_list

