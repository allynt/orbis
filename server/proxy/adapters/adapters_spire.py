from .adapters_base import BaseProxyDataAdapter
"""
Uses the api at: https://api.sense.spire.com/vessels
"""

# properties provided by the spire vessel API...
SPIRE_PROPERTIES = {
    "accuracy": "GPS Geo-Location Accuracy (metres)",
    # "ais_version": "ais_version",
    "call_sign": "Vessel Call Sign",
    # "class",
    "collection_type": "How the message was captured",
    "course": "Course (degrees)",
    "created_at": "Creation Date",
    "destination": "Vessel Destination",
    "draught": "Vessel Draught (metres)",
    "eta": "Estimated Time of Arrival",
    "flag": "Flag",
    "heading": "Heading (degrees)",
    "general_classification": "Vessel Type",
    "gross_tonnage": "Weight",
    "id": "id",
    "imo": "International Maritime Organization Number",
    "individual classification": "Vessel Sub-Type",
    "length": "Vessel Length (metres)",
    # "lifeboats": "lifeboats",
    "maneuver": "Vessel maneuver code",
    "mmsi": "Maritime Mobile Service Identity",
    "navigational_status": "Navigational Status",
    "name": "Vessel Name",
    "person_capacity": "Person Capacity",
    "rot": "Rate of Turn",
    "ship_type": "Vessel Type",
    "speed": "Vessel Speed (knots)",
    "status": "Vessel Navigation Status",
    # "to_bow",
    # "to_port",
    # "to_starboard",
    # "to_stern",
    "width": "Vessel Width (metres)",
    "timestamp": "Timestamp",
    "updated_at": "Update Date",
}  # yapf: disable

# possible property values used by the spire vessels API...
SPIRE_PROPERTY_VALUES = {
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

    def _reformat_data(self, data):
        """
        spire returns weird nested JSON that needs to be
        cleaned up before converting to GeoJSON
        """

        dimensions_props = data.pop("dimenstions", {})
        most_recent_voyage_props = data.pop("most_recent_voyage", {})
        geometry_props = data.pop("last_known_position", {})
        # predicted_geometry_props = data.pop("predicted_position", {})  # not dealing w/ for now

        data.update(dimensions_props)
        data.update(most_recent_voyage_props)
        data.update(geometry_props)

        return data

    def process_data(self, raw_data):

        # assume raw_data is the same shape as SAMPLE_DATA

        # yapf: disable

        processed_data = {
            "type": "FeatureCollection",
            "features": []
        }

        for i, rd in enumerate(raw_data["data"], start=1):
            d = self._reformat_data(rd)
            processed_data["features"].append({
                "id": d.pop("id", i),
                "type": "Feature",
                "geometry": d.pop("geometry"),
                "properties": {
                    SPIRE_PROPERTIES[k]:
                    v if k not in SPIRE_PROPERTY_VALUES
                    else SPIRE_PROPERTY_VALUES[k].get(str(v))
                    for k, v in d.items() if k in SPIRE_PROPERTIES
                }
            })

        return processed_data


    @property
    def SAMPLE_DATA(self):

        return {
            "paging": {
                'limit': 100,
                'total': 416918,
                'next': 'dGltZT0xNTAyNDc4MjI1LjYyMjI0NCxpZD1lNDdhZGM3MC1kNjFlLTQ1YmMtYjdhZi02YTFjOTA1NzA3MDE='
            },
            "data": [
                {
                    "created_at": "2017-08-11T19:24:21.193385+00:00",
                    "updated_at": "2018-05-21T16:20:09.824959+00:00",
                    "last_known_position": {
                        "timestamp": "2018-05-21T13:36:56+00:00",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -42.14087,
                                -25.19044
                            ]
                        },
                        "heading": 190,
                        "speed": 8.2,
                        "rot": 0,
                        "accuracy": None,
                        "collection_type": "satellite",
                        "draught": None,
                        "maneuver": 0,
                        "course": 187.4
                    },
                    "most_recent_voyage": {
                        "eta": "2018-04-25T21:00:00+00:00",
                        "destination": "NOUAKCHOT"
                    },
                    "predicted_position": {
                        "timestamp": "2018-05-21T17:51:05+00:00",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -42.2236022408,
                                -25.7641057924
                            ]
                        },
                        "speed": 8.2,
                        "course": 187.4,
                        "confidence_radius": 50.3796
                    },
                    "general_classification": "Merchant",
                    "individual_classification": "Bulk Carrier",
                    "gross_tonnage": "0",
                    "lifeboats": None,
                    "person_capacity": None,
                    "navigational_status": None
                }
            ]
        }  # yapf: disable
