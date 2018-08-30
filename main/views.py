from allauth.socialaccount.models import SocialAccount
from django.shortcuts import render
from django.utils import timezone

from main.forms import PostForm
from main.models import Post


def main_page(request):
    if request.POST.get('title'):
        now = timezone.now()
        title = request.POST.get('title')
        category = request.POST.get('category')
        post_type = request.POST.get('post_type')
        context = request.POST.get('context')

        if 'img src' in context:
            thumbnail = context.split('static/')[-1].split('"')[0]
        else:
            thumbnail = ""

        Post.objects.create(
            title=title,
            category=category,
            post_type=post_type,
            context=context,
            write_date=now,
            thumbnail=thumbnail,
        )

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
    user_info = get_user_info(request)

    pages = dict(
        max_page=max_page,
        page=page,
        next_page=next_page,
        prev_page=prev_page,
    )
    return render(request, 'main/main.html', dict(contents_list=contents_list, pages=pages, user_info=user_info))


def post_view(request):
    post_id = request.GET.get('id')
    user_info = get_user_info(request)

    post = Post.objects.filter(id=post_id).values().last()

    return render(request, 'main/view.html', dict(post=post, user_info=user_info))


def write(request):
    user_info = get_user_info(request)
    form = PostForm()
    contents_list = get_side_contents()
    return render(request, 'main/write.html', dict(form=form, contents_list=contents_list, user_info=user_info))


def guide(request):
    return render(request, 'base/write_guide.html')


def intro(request):
    contents_list = get_side_contents()
    user_info = get_user_info(request)
    return render(request, 'main/intro.html', dict(contents_list=contents_list, user_info=user_info))


def contact(request):
    user_info = get_user_info(request)
    contents_list = get_side_contents()
    return render(request, 'main/contact.html', dict(contents_list=contents_list, user_info=user_info))


def deleague(request):
    contents_list = get_side_contents()
    return render(request, 'main/deleague.html', dict(contents_list=contents_list))


def get_side_contents():
    small_post_list = Post.objects.filter(post_type='small').order_by('-write_date').values()[:3]
    all_post_list = Post.objects.order_by('-write_date').values()[:5]
    contents_list = dict(
        small_post_data=small_post_list,
        all_post_list=all_post_list,
    )

    return contents_list


def get_user_info(request):
    nickname = 'ANONYMOUS'
    profile_image = None

    if request.user.is_authenticated is True:
        social_account = SocialAccount.objects.get(user_id=request.user.id)
        if social_account:
            account_data = social_account.extra_data
            account_property = account_data.get('properties')
            nickname = account_property.get('nickname')
            profile_image = account_property.get('profile_image')

    user_info = dict(
        nickname=nickname,
        profile_image=profile_image,
    )

    return user_info
