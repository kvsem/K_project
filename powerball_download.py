import calendar
import sys
from datetime import date
from datetime import datetime, timedelta

from PyQt5.QtCore import QDate
from PyQt5.QtWidgets import QApplication, QWidget, QCalendarWidget, QPushButton, QMessageBox
from bs4 import BeautifulSoup
from openpyxl import Workbook
from openpyxl.writer.excel import save_virtual_workbook
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager


def powerball_download(start_date, end_date):
    _content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    _data = get_excel_data(start_date, end_date)
    content = save_virtual_workbook(_data)

    filename = f'{start_date}_{end_date}.xlsx'
    mkfile = open(filename, 'wb+')
    mkfile.write(content)
    mkfile.close()


def get_excel_data(start_date, end_date):
    delta = end_date - start_date

    result_info_vertical = dict()
    result_info_horizontal = dict()
    type_list = ['powerball_even_odd', 'powerball_under_over', 'even_odd', 'under_over']
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), chrome_options=chrome_options)
    for day in range(delta.days + 1):
        _date = start_date + timedelta(days=day)
        try:
            driver.get('http://ntry.com/stats/powerball/date.php?date=' + _date.strftime('%Y-%m-%d'))
            for _type in type_list:
                result_info_vertical = crawl_data(driver, result_info_vertical, _date, _type, 'vertical')

            for _type in type_list:
                result_info_horizontal = crawl_data(driver, result_info_horizontal, _date, _type, 'horizontal')

            print(str(_date))
        except:
            continue


    driver.quit()
    headers = ['날짜', '회차', '파워볼 홀짝', '파워볼 언더오버', '일반볼합 홀짝', '일반볼 언더오버']

    wb = Workbook()
    ws = wb.active
    ws.append(headers)

    for key in result_info_vertical:
        if not result_info_vertical.get(key):
            continue
        ws.append(result_info_vertical.get(key))

    ws1 = wb.create_sheet()
    ws1.append(headers)
    for key in result_info_horizontal:
        if not result_info_horizontal.get(key):
            continue
        ws1.append(result_info_horizontal.get(key))

    return wb


def crawl_data(driver, result_info, _date, _type, direction='vertical'):
    RED = 'EVEN'
    BLUE = 'ODD'

    RED_REPLACE = '짝'
    BLUE_REPLACE = '홀'

    WAIT_XPATH = '//*[@id="pattern-six-box"]/dl[1]/dd[1]/span'

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
        result_string_horizontal = dict()
        for vertical_index, pattern in enumerate(pattern_list, start=1):
            each_list = pattern.find_all('dd')
            _index = vertical_index
            result_string_vertical = ''
            for horizontal_index, each in enumerate(each_list, start=1):
                if direction == 'horizontal':
                    _index = horizontal_index

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

                if direction == 'vertical':
                    result_string_vertical += replace_string

                if direction == 'horizontal':
                    result_string_horizontal[_index] = result_string_horizontal.get(_index, '') + replace_string

            if direction == 'vertical':
                if result_info.get(f"{_date.strftime('%Y-%m-%d')}_{_index}"):
                    result_info[f"{_date.strftime('%Y-%m-%d')}_{_index}"].append(result_string_vertical)

                else:
                    result_info[f"{_date.strftime('%Y-%m-%d')}_{_index}"] = [_date.strftime('%Y-%m-%d'), _index, result_string_vertical]

        if direction == 'horizontal':
            for _index, key in enumerate(result_string_horizontal, start=1):
                result_string = result_string_horizontal.get(key)
                if result_info.get(f"{_date.strftime('%Y-%m-%d')}_{_index}"):
                    result_info[f"{_date.strftime('%Y-%m-%d')}_{_index}"].append(result_string)

                else:
                    result_info[f"{_date.strftime('%Y-%m-%d')}_{_index}"] = [_date.strftime('%Y-%m-%d'), _index, result_string]

    except Exception as e:
        return

    return result_info


class CalendarDemo(QWidget):
    current_day = datetime.now().day
    current_month = datetime.now().month
    current_year = datetime.now().year

    start_date = date(year=current_year, month=current_month, day=current_day)
    end_date = date(year=current_year, month=current_month, day=current_day)

    def __init__(self):
        super().__init__()
        self.setWindowTitle('K Powerball')
        self.setGeometry(500, 500, 600, 300)
        self.initUI()

    def initUI(self):
        self.calendar = QCalendarWidget(self)
        self.calendar.move(20, 20)
        self.calendar.setGridVisible(True)

        self.calendar.setMinimumDate(QDate(self.current_year, self.current_month - 1, 1))
        self.calendar.setMaximumDate(QDate(self.current_year, self.current_month + 1, calendar.monthrange(self.current_year, self.current_month)[1]))

        self.calendar.setSelectedDate(QDate(self.current_year, self.current_month, 1))

        self.calendar.clicked.connect(self.set_start_date)

        self.calendar_2 = QCalendarWidget(self)
        self.calendar_2.move(300, 20)
        self.calendar_2.setGridVisible(True)

        self.calendar_2.setMinimumDate(QDate(self.current_year, self.current_month - 1, 1))
        self.calendar_2.setMaximumDate(QDate(self.current_year, self.current_month + 1, calendar.monthrange(self.current_year, self.current_month)[1]))

        self.calendar_2.setSelectedDate(QDate(self.current_year, self.current_month, 1))

        self.calendar_2.clicked.connect(self.set_end_date)

        self.btn2 = QPushButton(self)
        self.btn2.move(20, 200)
        self.btn2.setText('다운로드')
        self.btn2.clicked.connect(self.download_excel)

    def set_start_date(self, qDate):
        self.start_date = date(year=qDate.year(), month=qDate.month(), day=qDate.day())

    def set_end_date(self, qDate):
        self.end_date = date(year=qDate.year(), month=qDate.month(), day=qDate.day())

    def download_excel(self):
        print(f'{self.start_date} ~ {self.end_date}')
        try:
            # powerball_download(self.start_date, self.end_date)
            powerball_download(date(2018, 1, 1), date(2020, 5, 6))
            QMessageBox.about(self, "Info", "다운로드 완료")
        except:
            QMessageBox.about(self, "Info", "다운로드 실패")


def main():
    app = QApplication(sys.argv)
    demo = CalendarDemo()
    demo.show()
    sys.exit(app.exec_())


main()
