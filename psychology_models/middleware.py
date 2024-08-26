from django.shortcuts import redirect


class RedirectToMainDomainMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.domains_to_redirect = [
            "psychomodels.com",
            "www.psychomodels.com",
            "psychomodels.net",
            "www.psychomodels.net",
            "psychomodels.org",
        ]
        self.target_domain = "www.psychomodels.org"

    def __call__(self, request):
        host = request.get_host()
        if host in self.domains_to_redirect:
            return redirect(
                f"https://{self.target_domain}{request.get_full_path()}", permanent=True
            )
        response = self.get_response(request)
        return response
