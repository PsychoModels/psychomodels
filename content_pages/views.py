from django.template import loader
from django.contrib import messages
from content_pages.forms import ContactForm
from django.shortcuts import redirect
from django.http import HttpResponse


def contact(request):
    template = loader.get_template("models/contact.html")
    context = {"form": ContactForm()}

    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.send_email(recipients=["leonhard.volz@gmail.com"])
            messages.success(request, "Message sent successfully.")
            return redirect("index")
        messages.error(request, "Unsuccessful submission. Invalid information.")
    return HttpResponse(template.render(context, request))


def index(request):
    template = loader.get_template("models/index.html")
    context = {}
    return HttpResponse(template.render(context, request))


def about(request):
    template = loader.get_template("models/about.html")
    context = {}
    return HttpResponse(template.render(context, request))


def tutorial(request):
    template = loader.get_template("models/tutorial.html")
    context = {}
    return HttpResponse(template.render(context, request))
