from django.shortcuts import render
from main.models import Main

def main_page(request):
    return render(request, 'main/main.html')
