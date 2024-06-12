import algoliasearch_django as algoliasearch

from . import models

algoliasearch.register(models.PsychologyModel)
