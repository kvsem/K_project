import json
import traceback

from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.utils import timezone
from django.views.generic import View

from main.forms import PostForm
from main.models import Post, Comment, Game
from utils.logger import logger


def get_request_body(body):
    return json.loads(body.decode('utf-8'))


def main_page(request):
    # PAGEING
    page = int(request.GET.get('page', 0))
    num_per_page = 2
    next_page = page + 1
    prev_page = page - 1 if page != 0 else 0
    start_at = page * num_per_page
    end_at = (page + 1) * num_per_page

    category = ''
    all_post_list = list(Post.objects.order_by('-write_date').values())

    if request.GET.get('category'):
        category = request.GET.get('category')
        all_post_list = list(Post.objects.order_by('-write_date').filter(category=category).values())

    post_list = all_post_list[start_at:end_at]
    count = len(all_post_list)

    if count % num_per_page == 0:
        max_page = count // num_per_page - 1
    else:
        max_page = count // num_per_page

    pages = dict(
        max_page=max_page,
        page=page,
        next_page=next_page,
        prev_page=prev_page,
    )

    # CONTENTS
    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    contents_list = get_contents_list(post_list)
    user_info = get_user_info(request)

    # CATEGORY
    category_list = list(Post.objects.distinct().values_list('category', flat=True))

    response = dict(all_post_list=all_post_list,
                    contents_list=contents_list,
                    side_popular_contents_list=side_popular_contents_list,
                    side_latest_contents_list=side_latest_contents_list,
                    pages=pages,
                    user_info=user_info,
                    category_list=category_list,
                    count=count,
                    category=category)

    return render(request, 'main/main.html', response)


def profile(request):
    user_info = get_user_info(request)

    user_id = request.GET.get('user_id')
    user = User.objects.get(id=user_id)
    email = user.email
    # phone = user.phone
    name = user.last_name + user.first_name

    account_data = None
    platform = None
    account_property = None
    nickname = None
    profile_image = None
    social_account = SocialAccount.objects.get(user_id=user_id)
    if social_account:
        account_data = social_account.extra_data
        platform = social_account.provider
        account_property = account_data.get('properties')
        nickname = account_property.get('nickname')
        if account_property.get('profile_image'):
            profile_image = account_property.get('profile_image').replace('http', 'https')
        else:
            profile_image = '/static/images/none_profile.png'

    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()

    profile_info = dict(
        user_id=user,
        profile_image=profile_image,
        nickname=nickname,
        email=email,
        # phone=phone,
        name=name,
        platform=platform,
    )
    return render(request, 'main/profile.html',
                  dict(side_popular_contents_list=side_popular_contents_list, side_latest_contents_list=side_latest_contents_list, user_info=user_info, profile_info=profile_info))


def post_view(request):
    post_id = request.GET.get('id')
    user_info = get_user_info(request)
    post = Post.objects.filter(id=post_id).values().last()
    if post is None:
        error_msg = '[post_id:{}] invalid access.'.format(post_id)
        logger.error(error_msg)
        redirect('/post')

    social_profile = SocialAccount.objects.get(user_id=post.get('user_id'))
    if social_profile:
        user_id = social_profile.user_id
        account_data = social_profile.extra_data
        account_property = account_data.get('properties')
        post['user_id'] = user_id
        post['nickname'] = account_property.get('nickname')
        if account_property.get('profile_image'):
            post['profile_image'] = account_property.get('profile_image').replace('http', 'https')
        else:
            post['profile_image'] = '/static/images/none_profile.png'

    # 댓글
    comment_list = list(Comment.objects.filter(post_id=post.get('id')).order_by('created_at').values())
    post['comment_list'] = get_comment_list(comment_list)

    return render(request, 'main/view.html', dict(post=post, user_info=user_info))


def write(request):
    user_info = get_user_info(request)
    form = PostForm()
    created = False

    if request.POST.get('title'):
        now = timezone.now()
        title = request.POST.get('title')
        category = request.POST.get('category')
        context = request.POST.get('context')
        user_id = request.user.id

        if 'img src' in context:
            thumbnail = context.split('static/')[-1].split('"')[0]
        else:
            thumbnail = ""

        Post.objects.create(
            title=title,
            category=category,
            context=context,
            write_date=now,
            thumbnail=thumbnail,
            user_id=user_id,
        )

        created = True

    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    return render(request, 'main/write.html',
                  dict(form=form, side_popular_contents_list=side_popular_contents_list, side_latest_contents_list=side_latest_contents_list, user_info=user_info, created=created))


def modify(request):
    user_info = get_user_info(request)

    form = PostForm()
    post_id = request.GET.get('id')
    modified = False

    if request.POST.get('title'):
        now = timezone.now()
        title = request.POST.get('title')
        post_id = request.POST.get('id')
        category = request.POST.get('category')
        context = request.POST.get('context')
        user_id = request.user.id

        if 'img src' in context:
            thumbnail = context.split('static/')[-1].split('"')[0]
        else:
            thumbnail = ""

        Post.objects.filter(id=post_id).update(
            title=title,
            category=category,
            context=context,
            updated_at=now,
            thumbnail=thumbnail,
        )
        modified = True

    post_info = Post.objects.filter(id=post_id).values().last()

    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    return render(request, 'main/modify.html',
                  dict(form=form, side_popular_contents_list=side_popular_contents_list, side_latest_contents_list=side_latest_contents_list, user_info=user_info, post_info=post_info, modified=modified))


def guide(request):
    return render(request, 'base/write_guide.html')


def intro(request):
    user_info = get_user_info(request)
    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    return render(request, 'main/intro.html', dict(side_popular_contents_list=side_popular_contents_list, side_latest_contents_list=side_latest_contents_list, user_info=user_info))


def contact(request):
    user_info = get_user_info(request)
    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    return render(request, 'main/contact.html', dict(side_popular_contents_list=side_popular_contents_list, side_latest_contents_list=side_latest_contents_list, user_info=user_info))


def game(request):
    user_info = get_user_info(request)
    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    last_game = Game.objects.filter(user_id=user_info.get('user_id')).last()
    last_game_score = 0
    if last_game:
        last_game_score = last_game.score

    game_rank_info_list = list(Game.objects.all().values())

    refined_rank_info_list = list()
    for game_rank_info in game_rank_info_list:
        user_id = game_rank_info.get('user_id')
        game_user_info = get_user_info_by_user_id(user_id)
        rank_info = dict(
            profile_image=game_user_info.get('profile_image'),
            username=game_user_info.get('nickname'),
            score=game_rank_info.get('score'),
        )
        refined_rank_info_list.append(rank_info)

    sorted_rank_info_list = sorted(refined_rank_info_list, key=lambda k: k['score'], reverse=True)

    return render(request, 'main/snake_game.html', dict(side_popular_contents_list=side_popular_contents_list, side_latest_contents_list=side_latest_contents_list, user_info=user_info, rank_info_list=sorted_rank_info_list, last_game_score=last_game_score))


def deleague(request):
    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    return render(request, 'main/deleague.html', dict(side_popular_contents_list=side_popular_contents_list, side_latest_contents_list=side_latest_contents_list, ))


def get_side_popular_contents():
    post_list = Post.objects.order_by('-like').values()[:3]
    return get_contents_list(post_list)


def get_side_latest_contents():
    post_list = Post.objects.order_by('-write_date').values()[:3]
    return get_contents_list(post_list)


def get_contents_list(post_list):
    contents_list = list()
    for post in post_list:
        social_profile = SocialAccount.objects.get(user_id=post.get('user_id'))
        if social_profile:
            user_id = social_profile.user_id
            account_data = social_profile.extra_data
            account_property = account_data.get('properties')
            post['user_id'] = user_id
            post['nickname'] = account_property.get('nickname')
            if account_property.get('profile_image'):
                post['profile_image'] = account_property.get('profile_image').replace('http', 'https')
            else:
                post['profile_image'] = '/static/images/none_profile.png'

        # 댓글
        comment_list = list(Comment.objects.filter(post_id=post.get('id')).order_by('created_at').values())
        post['comment_list'] = get_comment_list(comment_list)

        contents_list.append(post)

    return contents_list


def get_comment_list(comment_list):
    result_comment_list = list()
    for comment in comment_list:
        social_profile = SocialAccount.objects.get(user_id=comment.get('user_id'))
        if social_profile:
            account_data = social_profile.extra_data
            account_property = account_data.get('properties')
            comment['nickname'] = account_property.get('nickname')
            if account_property.get('profile_image'):
                comment['profile_image'] = account_property.get('profile_image').replace('http', 'https')
            else:
                comment['profile_image'] = '/static/images/none_profile.png'

        result_comment_list.append(comment)

    return result_comment_list


def get_user_info(request):
    user_id = None
    nickname = 'ANONYMOUS'
    profile_image = None

    if request.user.is_authenticated is True:
        social_account = SocialAccount.objects.get(user_id=request.user.id)
        if social_account:
            user_id = social_account.user_id
            account_data = social_account.extra_data
            account_property = account_data.get('properties')
            nickname = account_property.get('nickname')
            if account_property.get('profile_image'):
                profile_image = account_property.get('profile_image').replace('http', 'https')
            else:
                profile_image = '/static/images/none_profile.png'

    user_info = dict(
        user_id=user_id,
        nickname=nickname,
        profile_image=profile_image,
    )

    return user_info


def write_comment(request):
    user_info = get_user_info(request)
    created = False

    if request.POST.get('comment_text'):
        post_id = request.POST.get('post_id')
        context = request.POST.get('comment_text')
        user_id = request.user.id

        Comment.objects.create(
            post_id=post_id,
            comment=context,
            user_id=user_id,
        )

        created = True

    return redirect('/post')


def increase_like(request):
    try:
        post_data = eval(request.body.decode("utf-8"))
        post_id = post_data.get('post_id')

        if post_id:
            post_obj = Post.objects.get(id=post_id)
            post_obj.like += 1
            post_obj.save()

        response = dict(result_info='성공')
        return JsonResponse(response, json_dumps_params=dict(ensure_ascii=False, sort_keys=True), safe=False)
    except Exception as e:
        logger.error(e.args)
        logger.error(traceback.format_exc())
        return redirect('/post')


def get_user_info_by_user_id(user_id):
    social_account = SocialAccount.objects.get(user_id=user_id)
    user_info = dict()

    if social_account:
        user_id = social_account.user_id
        account_data = social_account.extra_data
        account_property = account_data.get('properties')
        nickname = account_property.get('nickname')
        if account_property.get('profile_image'):
            profile_image = account_property.get('profile_image').replace('http', 'https')
        else:
            profile_image = '/static/images/none_profile.png'

        user_info = dict(
            nickname=nickname,
            profile_image=profile_image,
        )

    return user_info


def gate(request):
    response = dict()
    return render(request, 'base/gate.html', dict(response=response))


class GameView(View):
    # API 서버 구축
    def get(self, request, *args, **kwargs):
        pass

    def post(self, request, *args, **kwargs):
        body = get_request_body(request.body)
        user = request.user
        score = body.get('score')

        if not user.id:
            response = dict()
            return JsonResponse(response, json_dumps_params=dict(ensure_ascii=False, sort_keys=True), safe=False)
        keys = dict(
            user_id=user.id,
        )

        # TODO 최대값 비교
        last_score = Game.objects.filter(user_id=user.id).values_list('score', flat=True).first()
        if not last_score:
            last_score = 0

        if score > last_score:
            Game.objects.update_or_create(**keys, defaults=dict(
                user_id=user.id,
                score=score
            ))

        response = dict()
        return JsonResponse(response, json_dumps_params=dict(ensure_ascii=False, sort_keys=True), safe=False)
