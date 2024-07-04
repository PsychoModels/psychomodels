import requests
from django.core.cache import cache


class CrossRefClient:
    def __init__(self, accept="text/x-bibliography; style=apa", timeout=3):
        self.headers = {"accept": accept}
        self.timeout = timeout

    def query(self, doi):

        # Check if the response is in the cache
        cached_response = cache.get(doi)
        if cached_response:
            return cached_response

        url = "http://dx.doi.org/" + doi

        r = requests.get(url, headers=self.headers)

        # Raise an HTTPError if the HTTP request returned an unsuccessful status code
        r.raise_for_status()

        if "charset" not in r.headers.get("content-type", "").lower():
            r.encoding = "utf-8"

        # Store the response in the cache
        cache.set(doi, r, timeout=60 * 60 * 24 * 7)  # Cache for 7 days
        return r

    def doi2apa(self, doi):
        self.headers["accept"] = "text/x-bibliography; style=apa"
        return self.query(doi).text

    def doi2turtle(self, doi):
        self.headers["accept"] = "text/turtle"
        return self.query(doi).text

    def doi2json(self, doi):
        self.headers["accept"] = "application/vnd.citationstyles.csl+json"
        return self.query(doi).json()
