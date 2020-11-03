import json

from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, "home/index.html")


def send_to_email(request):
    response_data = {}
    if request.method == "POST":
        data = request.POST
        if data:
            send_mail('Заявка', f'Имя:{data.get("name")}\n'
                                               f'Телефон:{data.get("phone")}\n'
                                               f'Что нужно!:{data.get("desk")}\n', settings.EMAIL_HOST_USER, ['drovasamara63@yandex.ru'])
            response_data['status'] = True
            response_data['message'] = 'Спасибо большое!'
        else:
            response_data['status'] = False
            response_data['message'] = 'Ввидете данные в поля'
        return HttpResponse(json.dumps(response_data), content_type="application/json")
