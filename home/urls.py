
from django.urls import path

from home import views

urlpatterns = [
    path('', views.index),
    path('sendEmail', views.send_to_email, name='send_to_email'),
]
