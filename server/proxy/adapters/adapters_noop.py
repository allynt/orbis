from .adapters_base import BaseProxyDataAdapter
"""
Used when there is no post-processing required by the proxy
"""


class NoopAdapter(BaseProxyDataAdapter):

    name = "noop"

    def process_data(self, raw_data):

        return raw_data
