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


def contact(request):
    template = loader.get_template("static_pages/contact.html")
    context = {}
    return HttpResponse(template.render(context, request))


def privacy_policy(request):
    template = loader.get_template("static_pages/privacy_policy.html")
    context = {}
    return HttpResponse(template.render(context, request))


def terms_conditions(request):
    template = loader.get_template("static_pages/terms_conditions.html")
    context = {}
    return HttpResponse(template.render(context, request))
