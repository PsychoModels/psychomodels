import requests


class CrossRefClient:
    def __init__(self, accept="text/x-bibliography; style=apa", timeout=3):
        self.headers = {"accept": accept}
        self.timeout = timeout

    def query(self, doi):
        url = "http://dx.doi.org/" + doi

        r = requests.get(url, headers=self.headers)

        # Raise an HTTPError if the HTTP request returned an unsuccessful status code
        r.raise_for_status()

        if "charset" not in r.headers.get("content-type", "").lower():
            r.encoding = "utf-8"
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
