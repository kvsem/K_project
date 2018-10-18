import json
from django.utils import timezone
from main.views import get_user_info, get_request_body
from .logger import logger


class CustomMiddleware:
    request_sequence = 0

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_now = timezone.now()

        self.request_sequence += 1
        if self.request_sequence >= 99999:
            self.request_sequence = 1

        sequence = str(self.request_sequence).zfill(5)
        method = request.method
        user_info = get_user_info(request)
        path = request.path
        body = request.body

        if body:
            if not request.content_type == 'multipart/form-data':
                body = json.loads(body.decode('utf-8'))
        else:
            body = ''

        if user_info.get('user_id'):
            logger.info('[{0}] [REQUEST] [{1}] USER_ID:{2}[{3}] {4} {5}'.format(sequence, method, user_info.get('user_id'), user_info.get('nickname'), path, body))
        else:
            logger.info('[{0}] [REQUEST] [{1}] [{2}] {3} {4}'.format(sequence, method, user_info.get('nickname'), path, body))

        response = self.get_response(request)
        response_now = timezone.now()
        time_diff = '[elapsed: {:.2f} ms]'.format((response_now - request_now).total_seconds() * 1000)
        logger.info('[{0}] [RESPONSE] {1} {2} {3}'.format(sequence, response.status_code, response.reason_phrase, time_diff))

        return response
