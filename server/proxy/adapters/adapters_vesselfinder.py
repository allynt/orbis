import itertools

from .adapters_base import BaseProxyDataAdapter
"""
Uses the live-data feed at: https://api.vesselfinder.com/docs/livedata.html

More information available at: https://www.vesselfinder.com/vessel-positions-api
"""


class VesselFinderAdapter(BaseProxyDataAdapter):

    name = "vesselfinder"

    # def get_data(self, proxy_data_source):
    #     assert proxy_data_source.authentication_token
    #     response = requests.get(
    #         proxy_data_source.proxy_url,
    #         params={
    #             "userkey": proxy_data_source.authentication_token
    #         }
    #     )
    #     return response.json()

    def process_data(self, raw_data):

        # assume raw_data is the same shape as SAMPLE_DATA

        # yapf: disable
        processed_data = {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": i,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            rd["AIS"].pop("LATITUDE"),
                            rd["AIS"].pop("LONGITUDE"),
                        ]
                    },
                    "properties": {
                        k: v
                        for k, v in itertools.chain(
                            rd.get("AIS", {}).items(),
                            rd.get("MASTERDATA", {}).items(),
                            rd.get("VOYAGE", {}).items()
                        )
                    }
                }
                for i, rd in enumerate(raw_data)
            ]
        }

        return processed_data

    @property
    def SAMPLE_DATA(self):
        return [
            {
                "AIS": {
                    "MMSI": 566554000,
                    "TIMESTAMP": "2017-08-11 11:43:42 UTC",
                    "LATITUDE": 54.29732,
                    "LONGITUDE": 4.75682,
                    "COURSE": 7.8,
                    "SPEED": 11.5,
                    "HEADING": 5,
                    "NAVSTAT": 0,
                    "IMO": 9607198,
                    "NAME": "BW HAWK",
                    "CALLSIGN": "9V2920",
                    "TYPE": 80,
                    "A": 150,
                    "B": 33,
                    "C": 9,
                    "D": 23,
                    "DRAUGHT": 9.2,
                    "DESTINATION": "FRURO>NOMLK",
                    "ETA_AIS": "08-17 00:01",
                    "ETA": "2017-08-17 00:01:00",
                    "SRC": "TER",
                    "ZONE": "North Sea",
                    "ECA": True
                },
                "MASTERDATA": {
                    "IMO": 9607198,
                    "NAME": "BW HAWK",
                    "FLAG": "SG",
                    "TYPE": "Chemical/Oil Products Tanker",
                    "BUILT": 2015,
                    "BUILDER": "SPP SB CO",
                    "OWNER": "BW CLEARWATER PTE LTD",
                    "MANAGER": "BW MARITIME PTE LTD",
                    "LENGTH": 183.0,
                    "BEAM": 32.2,
                    "MAXDRAUGHT": 0.0,
                    "GT": 29768,
                    "NT": 0,
                    "DWT": 49999,
                    "TEU": 0,
                    "CRUDE": 0
                },
                "VOYAGE": {
                    "LOCODE": "FRPET",
                    "DEPARTURE": "2017-08-09 17:26:38 UTC",
                    "LASTPORT": "Petit-Couronne",
                    "LASTCOUNTRY": "France"
                }
            }
        ]
