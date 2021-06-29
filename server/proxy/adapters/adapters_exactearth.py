import itertools
import json
import os
from .adapters_base import BaseProxyDataAdapter
"""
Uses the api at: https://services.exactearth.com/gws/wfs
"""

EXACTEARTH_PROPERTIES = {
    "callsign": "Vessel Call Sign",
    "cog": "Course Over Ground (degrees)",
    "destination": "Port of Destination",
    "draught": "Draught (meters)",
    "dt_insert_utc": "Timestamp of Last Insert (UTC)",
    "dt_pos_utc": "Timestamp of Last Position (UTC)",
    "dt_static_utc": "Timestamp of Last Static Message (UTC)",
    # "eeid": "exactEarth Identifier",
    # "eta": "Estimated Time of Arrival",  # TODO: THIS VALUE SEEMS WRONG
    # "flag_code": "Country of Registration Code",
    "flag_country": "Flag",
    "heading": "Heading (degrees)",
    "imo": "International Maritime Organization",
    "latitude": "latitude",
    "length": "Length of Bow to Stern",
    "longitude": "longitude",
    "message_type": "Message Type",
    "mmsi": "Maritime Mobile Service Identity",
    "nav_status": "Navigational Status",
    # "nav_status_code": "Navigational Status Code",
    "rot": "Rate of Turn (degrees)",
    "sog": "Speed Over Ground (knots)",
    "source": "Source of Position Report (Satellite AIS, Terrestrial AIS, or Vessel AIS)",
    # "ts_insert_utc": "20210614131242"
    # "ts_pos_utc": "20210614124333"
    # "ts_static_utc": "20210609092731"
    "vessel_class": "Vessel Class",
    "vessel_name": "Vessel Name",
    "vessel_type": "Vessel Type",
    "vessel_type_cargo": "Type of Cargo",
    # "vessel_type_code": "vessel_type_code",
    "vessel_type_main": "Type of Vessel",
    "vessel_type_sub": "SubType of Vessel",
    "width": "Length of Port to Starboard",
}  # yapf: disable

EXACTEARTH_PROPERTY_VALUES = {
    "message_type": {
        "1": "At anchor",
        "2": "Not under command",
        "3": "Restricted manoeuverability",
        "5": "Moored",
        "18": "Not defined (default)",
        "19": "Not defined (default)",
        "24": "Not defined (default)",
        "27": "Not defined (default)",
    },
    "vessel_type_code": {
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


class ExactEarthAdapter(BaseProxyDataAdapter):

    name = "exactearth"

    def process_data(self, raw_data):

        # assume raw_data is the same shape as SAMPLE_DATA

        # yapf: disable
        processed_data = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "id": rd.get("id", i),
                    "geometry": rd["geometry"],
                    "properties": {
                        EXACTEARTH_PROPERTIES[k]: v if k not in EXACTEARTH_PROPERTY_VALUES
                        else EXACTEARTH_PROPERTY_VALUES[k].get(str(v))
                        for k, v in rd["properties"].items() if k in EXACTEARTH_PROPERTIES
                    }
                }
                for i, rd in enumerate(raw_data["features"], start=1)
            ]
        }

        return processed_data

    @property
    def SAMPLE_DATA(self):

        return {
            "type": "FeatureCollection",
            "count": 1,
            "next": None,
            "previous": None,
            "features": [
                {
                    "type": "Feature",
                    "id": "4651209793901792320",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            112.80236667,
                            11.37465333
                        ]
                    },
                    "geometry_name": "position",
                    "properties": {
                        "mmsi": 357928000,
                        "imo": 9552355,
                        "vessel_name": "ROYAL KNIGHT",
                        "callsign": "3FMB9",
                        "vessel_type": "Cargo",
                        "vessel_type_code": 70,
                        "vessel_type_cargo": "",
                        "vessel_class": "A",
                        "length": 197,
                        "width": 32,
                        "flag_country": "Panama",
                        "flag_code": 357,
                        "destination": "INDIA",
                        "eta": "06201730",
                        "draught": 10.1,
                        "longitude": 112.80236666666667,
                        "latitude": 11.374653333333333,
                        "sog": 13.1,
                        "cog": 220.9,
                        "rot": 0,
                        "heading": 222,
                        "nav_status": "Under Way Using Engine",
                        "nav_status_code": 0,
                        "source": "S-AIS",
                        "ts_pos_utc": "20210614124333",
                        "ts_static_utc": "20210609092731",
                        "ts_insert_utc": "20210614131242",
                        "dt_pos_utc": "2021-06-14 12:43:33",
                        "dt_static_utc": "2021-06-09 09:27:31",
                        "dt_insert_utc": "2021-06-14 13:12:42",
                        "vessel_type_main": "Bulk Carrier",
                        "vessel_type_sub": "",
                        "message_type": 1,
                        "eeid": 4651209793901792320
                    }
                }
            ]
        }
