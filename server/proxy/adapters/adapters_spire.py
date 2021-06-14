import itertools
import json
import os

import pandas as pd
import geopandas as gpd

from .adapters_base import BaseProxyDataAdapter
"""
Uses the api at: https://www.aishub.net/api
"""

SPIRE_PROPERTIES = {
    "ship_and_cargo_type": "TYPE",
    "call_sign": "Vessel Call Sign",
    "width": "Vessel Width (metres)",
    "draught": "Vessel Draught (metres)",
    "name": "Vessel Name",
    # "to_stern",
    "speed": "Vessel Speed (knots)",
    "maneuver": "Vessel maneuver code",
    "flag": "Flag",
    "msg_type": "Message Type",
    # "to_bow",
    # "to_starboard",
    "status": "Vessel Navigation Status",
    "imo": "International Maritime Organization Number",
    "latitude": "latitude",
    "longitude": "longitude",
    "rot": "Rate of Turn",
    "collection_type": "How the message was captured",
    "course": "Course (degrees)",
    "destination": "Vessel Destination",
    "heading": "Heading (degrees)",
    "mmsi": "Maritime Mobile Service Identity",
    "timestamp": "Timestamp",
    "accuracy": "GPS Geo-Location Accuracy (metres)",
    "created_at": "Creation Date",
    "eta": "Estimated Time of Arrival",
    "length": "Vessel Length (metres)",
    # "to_port",
}  # yapf: disable

REQUIRED_SPIRE_PROPERTIES = ["latitude", "longitude"]

SPIRE_PROPERTY_VALUES = {
    "accuracy": {
        "0": "low (>10 metres)",
        "1": "high (<=10 metres)",
    },
    "msg_type": {
        "1": "At anchor",
        "2": "Not under command",
        "3": "Restricted manoeuverability",
        "5": "Moored",
        "18": "Not defined (default)",
        "19": "Not defined (default)",
        "24": "Not defined (default)",
        "27": "Not defined (default)",

    },
    "status": {
        "0": "under way using engine",
        "1": "at anchor",
        "3": "restricted maneuverability",
        "7": "engaged in fishing",
    },
    "maneuver": {
        "0": "not available",
        "1": "not engaged in special maneuver",
        "2": "engaged in special maneuver",
    },
    "TYPE": {
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


class SpireMaritimeAdapter(BaseProxyDataAdapter):

    name = "spire"

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
                            float(rd.pop("longitude")),
                            float(rd.pop("latitude")),
                        ]
                    },
                    "properties": {
                        SPIRE_PROPERTIES[k]:
                        v if k not in SPIRE_PROPERTY_VALUES
                        else SPIRE_PROPERTY_VALUES[k].get(str(v))
                        for k, v in rd.items() if k in SPIRE_PROPERTIES
                    }
                }
                for i, rd in enumerate(raw_data)
            ]
        }

        return processed_data

    @property
    def SAMPLE_DATA(self):
        # (note this sample data is in the South China Sea)

        # with pd.read_csv(
        #     os.path.join(
        #         os.path.abspath(os.path.dirname(__file__)),
        #         "sample_data/DAIS_SouthChinaSea_20200820.csv"
        #     ),
        #     chunksize=100,
        # ) as reader:
        #     for df_chunk in reader:
        #         yield df_chunk.dropna(
        #             axis=0, subset=REQUIRED_SPIRE_PROPERTIES,
        #         )


        data_frame = pd.read_csv(
            os.path.join(
                os.path.abspath(os.path.dirname(__file__)),
                "sample_data/DAIS_SouthChinaSea_20200820.csv"
            )
        ).dropna(
            axis=0, subset=REQUIRED_SPIRE_PROPERTIES
        )

        data_dict = json.loads(
            data_frame.to_json(orient="records")
        )
        return data_dict
