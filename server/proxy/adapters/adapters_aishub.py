import itertools

from .adapters_base import BaseProxyDataAdapter, ProxyDataException
"""
Uses the api at: https://www.aishub.net/api
"""

AISHUB_PROPERTIES = {
    "MMSI": "Maritime Mobile Service Identity",
    "TIME": "Timestamp",
    "LONGITUDE": "LONGITUDE",
    "LATITUDE": "LATITUDE",
    "COG": "Course Over Ground (degrees)",
    "SOG": "Speed Over Ground (knots)",
    "HEADING": "HEADING",
    "PAC": "Position Accuracy",
    "ROT": "Rate of Turn",
    "NAVSTAT": "Navigational Status",
    "IMO": "IMO Ship Identification Number",
    "NAME": "Vessel Name",
    "TYPE": "Vessel Type",
    "DEVICE": "Positioning Device Type",
    "A": "Dimension to Bow (metres)",
    "B": "Dimension to Stern (metres)",
    "C": "Dimension to Port (metres)",
    "D": "Dimension to Starborad (metres)",
    "DRAUGHT": "Draught (metres)",
    "DEST": "Vessel's Destination",
    "ETA": "Estimated Time of Arrival",
}  # yapf: disable

AISHUB_PROPERTY_VALUES = {
    "NAVSTAT": {
        "0": "Under way using engine",
        "1": "At anchor",
        "2": "Not under command",
        "3": "Restricted manoeuverability",
        "4": "Constrained by her draught",
        "5": "Moored",
        "6": "Aground",
        "7": "Engaged in Fishing",
        "8": "Under way sailing",
        "9": "Reserved for future amendment of Navigational Status for HSC",
        "10": "Reserved for future amendment of Navigational Status for WIG",
        "11": "Reserved for future use",
        "12": "Reserved for future use",
        "13": "Reserved for future use",
        "14": "AIS-SART is active",
        "15": "Not defined (default)",
    },
    "Vessel Type": {
        "0": "Not available (default)",
        # "1-19": "Reserved for future use",
        "20": "Wing in ground (WIG), all ships of this type",
        "21": "Wing in ground (WIG), Hazardous category A",
        "22": "Wing in ground (WIG), Hazardous category B",
        "23": "Wing in ground (WIG), Hazardous category C",
        "24": "Wing in ground (WIG), Hazardous category D",
        "25": "Wing in ground (WIG), Reserved for future use",
        "26": "Wing in ground (WIG), Reserved for future use",
        "27": "Wing in ground (WIG), Reserved for future use",
        "28": "Wing in ground (WIG), Reserved for future use",
        "29": "Wing in ground (WIG), Reserved for future use",
        "30": "Fishing",
        "31": "Towing",
        "32": "Towing: length exceeds 200m or breadth exceeds 25m",
        "33": "Dredging or underwater ops",
        "34": "Diving ops",
        "35": "Military ops",
        "36": "Sailing",
        "37": "Pleasure Craft",
        "38": "Reserved",
        "39": "Reserved",
        "40": "High speed craft (HSC), all ships of this type",
        "41": "High speed craft (HSC), Hazardous category A",
        "42": "High speed craft (HSC), Hazardous category B",
        "43": "High speed craft (HSC), Hazardous category C",
        "44": "High speed craft (HSC), Hazardous category D",
        "45": "High speed craft (HSC), Reserved for future use",
        "46": "High speed craft (HSC), Reserved for future use",
        "47": "High speed craft (HSC), Reserved for future use",
        "48": "High speed craft (HSC), Reserved for future use",
        "49": "High speed craft (HSC), No additional information",
        "50": "Pilot Vessel",
        "51": "Search and Rescue vessel",
        "52": "Tug",
        "53": "Port Tender",
        "54": "Anti-pollution equipment",
        "55": "Law Enforcement",
        "56": "Spare - Local Vessel",
        "57": "Spare - Local Vessel",
        "58": "Medical Transport",
        "59": "Noncombatant ship according to RR Resolution No. 18",
        "60": "Passenger, all ships of this type",
        "61": "Passenger, Hazardous category A",
        "62": "Passenger, Hazardous category B",
        "63": "Passenger, Hazardous category C",
        "64": "Passenger, Hazardous category D",
        "65": "Passenger, Reserved for future use",
        "66": "Passenger, Reserved for future use",
        "67": "Passenger, Reserved for future use",
        "68": "Passenger, Reserved for future use",
        "69": "Passenger, No additional information",
        "70": "Cargo, all ships of this type",
        "71": "Cargo, Hazardous category A",
        "72": "Cargo, Hazardous category B",
        "73": "Cargo, Hazardous category C",
        "74": "Cargo, Hazardous category D",
        "75": "Cargo, Reserved for future use",
        "76": "Cargo, Reserved for future use",
        "77": "Cargo, Reserved for future use",
        "78": "Cargo, Reserved for future use",
        "79": "Cargo, No additional information",
        "80": "Tanker, all ships of this type",
        "81": "Tanker, Hazardous category A",
        "82": "Tanker, Hazardous category B",
        "83": "Tanker, Hazardous category C",
        "84": "Tanker, Hazardous category D",
        "85": "Tanker, Reserved for future use",
        "86": "Tanker, Reserved for future use",
        "87": "Tanker, Reserved for future use",
        "88": "Tanker, Reserved for future use",
        "89": "Tanker, No additional information",
        "90": "Other Type, all ships of this type",
        "91": "Other Type, Hazardous category A",
        "92": "Other Type, Hazardous category B",
        "93": "Other Type, Hazardous category C",
        "94": "Other Type, Hazardous category D",
        "95": "Other Type, Reserved for future use",
        "96": "Other Type, Reserved for future use",
        "97": "Other Type, Reserved for future use",
        "98": "Other Type, Reserved for future use",
        "99": "Other Type, no additional information",
    }
}  # yapf: disable

class AISHubFinderAdapter(BaseProxyDataAdapter):

    name = "aishub"

    def process_data(self, raw_data):

        # assume raw_data is the same shape as SAMPLE_DATA

        # yapf: disable

        raw_data_summary = raw_data[0]
        if raw_data_summary.get("ERROR") is True:
            # note: a common error w/ aishub is trying to access the server more frequenly than 1/minute
            raise ProxyDataException(raw_data_summary.get("ERROR_MESSAGE", ""))

        processed_data = {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": i,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            float(rd.pop("LONGITUDE")),
                            float(rd.pop("LATITUDE")),
                        ]
                    },
                    "properties": {
                        AISHUB_PROPERTIES[k]:
                        v if k not in AISHUB_PROPERTY_VALUES
                        else AISHUB_PROPERTY_VALUES[k].get(str(v))
                        for k, v in rd.items() if k in AISHUB_PROPERTIES
                    }
                }
                for i, rd in enumerate(raw_data[1], start=1)
            ]
        }

        return processed_data

    @property
    def SAMPLE_DATA(self):
        # (note this sample data is SW of Beijing)
        return [{
            "MMSI": "413811000",
            "TIME": "2011-04-12 10:40:27 GMT",
            "LONGITUDE": "118.44586666667",
            "LATITUDE": "38.874833333333",
            "COG": "356",
            "SOG": "0.1",
            "HEADING": "116",
            "NAVSTAT": "1",
            "IMO": "9118824",
            "NAME": "JIN HAI XIANG",
            "CALLSIGN": "BVKU",
            "TYPE": "70",
            "A": "197",
            "B": "27",
            "C": "20",
            "D": "12",
            "DRAUGHT": "7.5",
            "DEST": "CAOFEIDIAN",
            "ETA": "04-10 07:00",
        }]
