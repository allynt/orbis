"""
Uses the H2Orb api at: https://portal.fogwing.net/api/dstorage/getData/withApiKey
"""

import random

from .adapters_base import BaseProxyDataAdapter


class PldAdapter(BaseProxyDataAdapter):

    name = "h2orb_fallback"

    def process_data(self, raw_data):
        """ Something """
        random.shuffle(raw_data)

        return raw_data

    @property
    def SAMPLE_DATA(self):
        return []
