from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    context_dict = {'welcome': "Welcome to trackly!"}
    return render(request, 'trackly/index.html', context_dict)

# Create your views here.
