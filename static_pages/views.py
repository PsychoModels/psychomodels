from django.template import loader
from django.http import HttpResponse


def homepage(request):
    template = loader.get_template("static_pages/homepage.html")
    context = {}
    return HttpResponse(template.render(context, request))


def about(request):
    template = loader.get_template("static_pages/about.html")
    context = {}
    return HttpResponse(template.render(context, request))


def tutorial(request):
    template = loader.get_template("static_pages/tutorial.html")
    context = {}
    return HttpResponse(template.render(context, request))
