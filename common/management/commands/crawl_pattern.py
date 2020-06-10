import os
import traceback
from collections import OrderedDict
from datetime import timedelta, datetime
from subprocess import call

from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from django.utils import timezone
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

from main.models import AnalyticsPattern


class Command(BaseCommand):
    help = '패턴 분석을 위한 데이터 수집'

    start_date = timezone.localdate() - timedelta(days=1)
    end_date = start_date

    RED = 'EVEN'
    BLUE = 'ODD'

    RED_REPLACE = '짝'
    BLUE_REPLACE = '홀'

    WAIT_XPATH = '//*[@id="pattern-six-box"]/dl[48]/dd[6]/span'

    def add_arguments(self, parser):
        parser.add_argument('--start_date', type=str, help="2020-06-01")
        parser.add_argument('--end_date', type=str, help="2020-06-01")
        # parser.add_argument('--isfile', action='store_true', default=False, help="파일 경로 여부")
        pass

    def crawl_data(self, driver, _date, _type):
        result_string = ''

        if _type == AnalyticsPattern.PATTERN_TYPE_POWERBALL_UNDER_OVER:
            self.RED = 'OVER'
            self.BLUE = 'UNDER'
            self.RED_REPLACE = '오'
            self.BLUE_REPLACE = '언'
            element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[2]/a')
            driver.execute_script("arguments[0].click();", element)
        elif _type == AnalyticsPattern.PATTERN_TYPE_EVEN_ODD:
            self.RED = 'EVEN'
            self.BLUE = 'ODD'
            self.RED_REPLACE = '짝'
            self.BLUE_REPLACE = '홀'
            element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[3]/a')
            driver.execute_script("arguments[0].click();", element)
        elif _type == AnalyticsPattern.PATTERN_TYPE_UNDER_OVER:
            self.RED = 'OVER'
            self.BLUE = 'UNDER'
            self.RED_REPLACE = '오'
            self.BLUE_REPLACE = '언'
            element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[4]/a')
            driver.execute_script("arguments[0].click();", element)
        else:
            self.RED = 'EVEN'
            self.BLUE = 'ODD'
            self.RED_REPLACE = '짝'
            self.BLUE_REPLACE = '홀'
            element = driver.find_element_by_xpath('//*[@id="pattern_six_tab"]/li[1]/a')
            driver.execute_script("arguments[0].click();", element)

        try:
            element = WebDriverWait(driver, 10).until(
                expected_conditions.presence_of_element_located((By.XPATH, self.WAIT_XPATH))
            )
        except:
            return result_string

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

                    if result == self.BLUE:
                        replace_string = self.BLUE_REPLACE
                    else:
                        replace_string = self.RED_REPLACE

                    result_string += replace_string

        except Exception as e:
            return

        return result_string

    def powerball_pattern(self, driver, _type):
        if os.getenv('IS_EXIST_CHROME'):
            call(['killall', '-9', 'chrome'])

        pattern_info = dict()

        if _type == 'powerball_under_over' or _type == 'under_over':
            self.RED = 'OVER'
            self.BLUE = 'UNDER'
            self.RED_REPLACE = '오'
            self.BLUE_REPLACE = '언'

        delta = self.end_date - self.start_date

        obj_list = list()
        for day in range(delta.days + 1):
            _date = self.start_date + timedelta(days=day)

            if AnalyticsPattern.objects.filter(ref_date=_date, pattern_type=_type).exists():
                AnalyticsPattern.objects.filter(ref_date=_date, pattern_type=_type).delete()

            driver.get('http://ntry.com/stats/powerball/date.php?date=' + _date.strftime('%Y-%m-%d'))
            result_string = self.crawl_data(driver, _date, _type)
            if not result_string:
                continue

            for _index, _str in enumerate(result_string):
                for _pattern in range(5, 16):
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

            result_list = dict()
            for _string, _count in pattern_info.items():
                if _string in result_list.keys():
                    continue

                result_list[_string] = _count
                obj = AnalyticsPattern(
                    ref_date=_date,
                    pattern_type=_type,
                    pattern_num=len(_string),
                    pattern_string=_string,
                    pattern_count=_count,
                )

                origin_string = _string.replace(self.RED_REPLACE, self.RED).replace(self.BLUE_REPLACE, self.BLUE)
                _string = origin_string.replace(self.RED, self.BLUE_REPLACE).replace(self.BLUE, self.RED_REPLACE)
                result_list[_string] = pattern_info.get(_string) or 0

                obj.opposite_string = origin_string.replace(self.RED, self.BLUE_REPLACE).replace(self.BLUE, self.RED_REPLACE)
                obj.opposite_count = pattern_info.get(_string)

                obj_list.append(obj)

                if len(obj_list) > 5000:
                    AnalyticsPattern.objects.bulk_create(obj_list)
                    obj_list.clear()

        if len(obj_list) > 0:
            AnalyticsPattern.objects.bulk_create(obj_list)
            obj_list.clear()

        return

    def handle(self, *args, **options):
        if options.get('start_date'):
            self.start_date = datetime.strptime(options.get('start_date'), '%Y-%m-%d')

        if options.get('end_date'):
            self.end_date = datetime.strptime(options.get('end_date'), '%Y-%m-%d')

        patterns = [AnalyticsPattern.PATTERN_TYPE_POWERBALL_UNDER_OVER, AnalyticsPattern.PATTERN_TYPE_POWERBALL_EVEN_ODD, AnalyticsPattern.PATTERN_TYPE_UNDER_OVER, AnalyticsPattern.PATTERN_TYPE_EVEN_ODD]

        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        try:
            driver = webdriver.Chrome(executable_path=os.getenv('CHROME_DRIVER_PATH'), chrome_options=chrome_options)
        except:
            driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), chrome_options=chrome_options)

        for _type in patterns:
            self.powerball_pattern(driver, _type)

        driver.quit()
