import json
import os
import traceback
from datetime import timedelta, datetime

import requests
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.models import User
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.utils import timezone
from django.views.generic import View
from openpyxl import Workbook
from openpyxl.writer.excel import save_virtual_workbook
from bs4 import BeautifulSoup

from common import constant
from main.forms import PostForm
from main.models import Post, Comment, Game
from utils.logger import logger


def get_request_body(body):
    return json.loads(body.decode('utf-8'))


def main_page(request):
    page = request.GET.get('page', 1)

    category = ''
    all_post_list = list(Post.objects.order_by('-write_date').values())

    if request.GET.get('category'):
        category = request.GET.get('category')
        all_post_list = list(Post.objects.order_by('-write_date').filter(category=category).values())

    return_post_list = []
    for all_post in all_post_list:
        return_post = dict(
            id=all_post.get('id'),
            title=all_post.get('title'),
            category=all_post.get('category'),
            user_id=all_post.get('user_id'),
            write_date=all_post.get('write_date'),
            context=all_post.get('context'),
            like=all_post.get('like'),
            thumbnail=Post().get_thumbnail(category),
        )

        return_post_list.append(return_post)

    # CONTENTS
    side_popular_contents_list = get_side_popular_contents()
    side_latest_contents_list = get_side_latest_contents()
    contents_list = get_contents_list(return_post_list)
    user_info = get_user_info(request)

    # CATEGORY
    category_list = list(Post.objects.distinct().values_list('category', flat=True))

    paginator = Paginator(contents_list, constant.POST_PER_PAGE)

    try:
        paginated_contents_list = paginator.page(page)
    except PageNotAnInteger:
        paginated_contents_list = paginator.page(1)
    except EmptyPage:
        paginated_contents_list = paginator.page(paginator.num_pages)

    response = dict(all_post_list=return_post_list,
                    contents_list=paginated_contents_list,
                    side_popular_contents_list=side_popular_contents_list,
                    side_latest_contents_list=side_latest_contents_list,
                    user_info=user_info,
                    category_list=category_list,
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
    profile_image = '/static/images/none_profile.png'

    if SocialAccount.objects.filter(user_id=user_id).exists():
        social_account = SocialAccount.objects.get(user_id=user_id)
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


def powerball(request):
    return render(request, 'test/powerball.html')


def powerball_pattern(request):
    pattern_info = dict()
    end_date = datetime.strptime(request.POST.get('end_date'), '%Y-%m-%d')
    start_date = datetime.strptime(request.POST.get('start_date'), '%Y-%m-%d')
    _type = request.POST.get('type')
    _pattern = int(request.POST.get('pattern'))

    if _pattern < 4:
        error_message = '3보다 큰 숫자를 입력해주세요.'
        return render(request, 'test/powerball.html', dict(result=list(), error_message=error_message))

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(executable_path=os.getenv('CHROME_DRIVER_PATH'), chrome_options=chrome_options)

    result_string = ''
    delta = end_date - start_date

    for day in range(delta.days + 1):
        _date = start_date + timedelta(days=day)
        driver.get('http://ntry.com/stats/powerball/date.php?date=' + _date.strftime('%Y-%m-%d'))
        result_string += crawl_data(driver, _date, _type)

    driver.quit()

    for _index, _str in enumerate(result_string):
        try:
            target_string = result_string[_index: _index + _pattern]
        except:
            break

        if len(target_string) < _pattern:
            continue

        if pattern_info.get(target_string):
            pattern_info[target_string] = pattern_info.get(target_string) + 1
        else:
            pattern_info[target_string] = 1

    sorted_pattern_info_list = sorted(pattern_info.items(), key=lambda x: x[1], reverse=True)

    return render(request, 'test/powerball_pattern.html', dict(result=sorted_pattern_info_list))


# def get_excel_data(start_date, end_date):
#     delta = end_date - start_date
#
#     result_info_vertical = dict()
#     result_info_horizontal = dict()
#     type_list = ['powerball_even_odd', 'powerball_under_over', 'even_odd', 'under_over']
#     for day in range(delta.days + 1):
#         _date = start_date + timedelta(days=day)
#         chrome_options = webdriver.ChromeOptions()
#         chrome_options.add_argument('--headless')
#         chrome_options.add_argument('--no-sandbox')
#         chrome_options.add_argument('--disable-dev-shm-usage')
#         driver = webdriver.Chrome(executable_path=os.getenv('CHROME_DRIVER_PATH'), chrome_options=chrome_options)
#         driver.get('http://ntry.com/stats/powerball/date.php?date=' + _date.strftime('%Y-%m-%d'))
#
#         for _type in type_list:
#             result_info_vertical = crawl_data(driver, result_info_vertical, _date, _type, 'vertical')
#
#         for _type in type_list:
#             result_info_horizontal = crawl_data(driver, result_info_horizontal, _date, _type, 'horizontal')
#
#         driver.quit()
#
#     headers = ['날짜', '회차', '파워볼 홀짝', '파워볼 언더오버', '일반볼합 홀짝', '일반볼 언더오버']
#
#     wb = Workbook()
#     ws = wb.active
#     ws.append(headers)
#
#     for key in result_info_vertical:
#         if not result_info_vertical.get(key):
#             continue
#         ws.append(result_info_vertical.get(key))
#
#     ws1 = wb.create_sheet()
#     ws1.append(headers)
#     for key in result_info_horizontal:
#         if not result_info_horizontal.get(key):
#             continue
#         ws1.append(result_info_horizontal.get(key))
#
#     return wb


def crawl_data(driver, _date, _type):
    result_string = ''
    RED = 'EVEN'
    BLUE = 'ODD'

    RED_REPLACE = '짝'
    BLUE_REPLACE = '홀'

    WAIT_XPATH = '//*[@id="pattern-six-box"]/dl[48]/dd[6]/span'

    if _type == 'powerball_under_over':
        RED = 'OVER'
        BLUE = 'UNDER'
        RED_REPLACE = '오'
        BLUE_REPLACE = '언'
        element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[2]/a')
        driver.execute_script("arguments[0].click();", element)
    elif _type == 'even_odd':
        element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[3]/a')
        driver.execute_script("arguments[0].click();", element)
    elif _type == 'under_over':
        RED = 'OVER'
        BLUE = 'UNDER'
        RED_REPLACE = '오'
        BLUE_REPLACE = '언'
        element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[4]/a')
        driver.execute_script("arguments[0].click();", element)
    else:
        element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[1]/a')
        driver.execute_script("arguments[0].click();", element)

    try:
        element = WebDriverWait(driver, 10).until(
            expected_conditions.presence_of_element_located((By.XPATH, WAIT_XPATH))
        )

    finally:
        soup = BeautifulSoup(driver.page_source, 'html.parser')

    try:
        pattern_box = soup.find('div', {'id': 'pattern-six-box'})
        pattern_list = pattern_box.find_all('dl')
        for pattern in pattern_list:
            each_list = pattern.find_all('dd')
            for each in each_list:
                if not each:
                    continue

                _span = each.find('span')
                if not _span:
                    continue

                result = _span.attrs.get('title')

                if not result:
                    continue

                if result == BLUE:
                    replace_string = BLUE_REPLACE
                else:
                    replace_string = RED_REPLACE

                result_string += replace_string

    except Exception as e:
        logger.error(e.args)
        logger.error(traceback.format_exc())
        return

    return result_string


def post_view(request):
    post_id = request.GET.get('id')
    user_info = get_user_info(request)
    post = Post.objects.filter(id=post_id).values().last()
    if post is None:
        error_msg = '[post_id:{}] invalid access.'.format(post_id)
        logger.warning(error_msg)
        return redirect('/post')

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

        Post.objects.create(
            title=title,
            category=category,
            context=context,
            write_date=now,
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

        Post.objects.filter(id=post_id).update(
            title=title,
            category=category,
            context=context,
            updated_at=now,
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
    return_post_list = []
    for post in post_list:
        return_post = dict(
            id=post.get('id'),
            title=post.get('title'),
            category=post.get('category'),
            user_id=post.get('user_id'),
            write_date=post.get('write_date'),
            context=post.get('context'),
            like=post.get('like'),
            thumbnail=Post().get_thumbnail(post.get('category')),
        )

        return_post_list.append(return_post)

    return get_contents_list(return_post_list)


def get_side_latest_contents():
    post_list = Post.objects.order_by('-write_date').values()[:3]
    return_post_list = []
    for post in post_list:
        return_post = dict(
            id=post.get('id'),
            title=post.get('title'),
            category=post.get('category'),
            user_id=post.get('user_id'),
            write_date=post.get('write_date'),
            context=post.get('context'),
            like=post.get('like'),
            thumbnail=Post().get_thumbnail(post.get('category')),
        )

        return_post_list.append(return_post)

    return get_contents_list(return_post_list)


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
    profile_image = '/static/images/none_profile.png'

    if request.user.is_authenticated is True:
        if SocialAccount.objects.filter(user_id=request.user.id).exists():
            social_account = SocialAccount.objects.get(user_id=request.user.id)
            user_id = social_account.user_id
            account_data = social_account.extra_data
            account_property = account_data.get('properties')
            nickname = account_property.get('nickname')
            if account_property.get('profile_image'):
                profile_image = account_property.get('profile_image').replace('http', 'https')
            else:
                profile_image = '/static/images/none_profile.png'

        else:
            user_id = request.user.id
            nickname = request.user.username

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
