'use strict';


const GEOLOGY = [
  {
    "name": "Bedrock",
    "polygons": [
      "316217.764,647219.637 295209,659480 326077,684395 336086,655597 336188,655594 316217.764,647219.637"
    ],
    "attributes": {
      "Rock Unit": "Portpatrick Formation (PPF)<br><a href=\"http://www.bgs.ac.uk/Lexicon/lexicon.cfm?pub=PPF\" target=\"_blank\">More information from the British Geological Society</a><br>(opens in a new window)",
      "Rock Type": "Wacke (WACKE)<br><a href=\"http://www.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=WACKE\" target=\"_blank\">More information from the British Geological Society</a><br>(opens in a new window)",
      "Age": "Caradoc epoch",
      "Style": "/bgs50k/poly_bedro_35959.png"
    }
  },
  {
    "name": "Bedrock2",
    "polygons": [
      "334213,648341 295209,659480 326077,684395 336086,655597 336188,655594 334213,648341"
    ],
    "attributes": {
      "Rock Type": "Portpatrick Formation (PPF)<br><a href=\"http://www.bgs.ac.uk/Lexicon/lexicon.cfm?pub=PPF\" target=\"_blank\">More information from the British Geological Society</a><br>(opens in a new window)",
      "Rock Type": "Wacke (WACKE)<br><a href=\"http://www.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=WACKE\" target=\"_blank\">More information from the British Geological Society</a><br>(opens in a new window)",
      "Age": "43",
      "Style": "/bgs50k/poly_bedro_35959.png"
    }
  },
  {
    "name": "Bedrock2",
    "polygons": [
      "340097,675651 336052,655597 336086,655597 336086,655596 333253,336120,655596 336120,655595 336154,655595 336154,655594 336188,655594 340097,675651 "
    ],
    "attributes": {
      "Rock Type": "Portpatrick Formation (PPF)<br><a href=\"http://www.bgs.ac.uk/Lexicon/lexicon.cfm?pub=PPF\" target=\"_blank\">More information from the British Geological Society</a><br>(opens in a new window)",
      "Rock Type": "Wacke (WACKE)<br><a href=\"http://www.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=WACKE\" target=\"_blank\">More information from the British Geological Society</a><br>(opens in a new window)",
      "Age": "43",
      "Style": "/bgs50k/poly_bedro_36599.png"
    }
  }
];

const HISTORIC = [
  {
    "name": "County Sheet Roxburghshire",
    "polygons": [

    ],
    "attributes": {
      "Sheet Title": "Roxburghshire Sheet XXXVIII",
      "Product": "County Series 1:10560",
      "Scale": "10560",
      "Edition": "1st Edition",
      "County": "Roxburghshire",
      "Year Surveyed": "1858",
      "Year Published": "1863",
      "Date Source": "National Library of Scotland"
    }
  },
  {
    "name": "County Sheet Dumfriesshire",
    "polygons": [

    ],
    "attributes": {
      "Sheet Title": "Dumfriesshire Sheet XXVIII",
      "Product": "County Series 1:10560",
      "Scale": "10560",
      "Edition": "1st Edition",
      "County": "Dumfriesshire",
      "Year Surveyed": "1858",
      "Year Published": "1863",
      "Date Source": "National Library of Scotland"
    }
  }
];

const MARINE = [
  {
    "name": "Depth area (<= 10m)",
    "polygons": [

    ],
    "attributes": {
      "Minimum Depth": "2",
      "Maximum Depth": "5"
    }
  },
  {
    "name": "Military practice area",
    "polygons": [

    ],
    "attributes": {
      "Feature Name": "X5613(S)",
      "Category": "Military practice area category: practice and exercise area",
      "General Information": "ITEM_ID: 158 AUTHTY: NAVY DEPT CATMPA: practice and exercise area (surface fleet) IDENTY: FIRTH OF FORTH MILACT: GP,MCM OBJNAM: X5613(S)"
    }
  },
  {
    "name": "Depth contour",
    "polygons": [

    ],
    "attributes": {
      "Feature Name": "2",
      "Depth Contour Value": "2"
    }
  },
  {
    "name": "Depth area (<= 10m)",
    "polygons": [

    ],
    "attributes": {
      "Minimum Depth": "0",
      "Maximum Depth": "2"
    }
  },
  {
    "name": "Depth contour",
    "polygons": [

    ],
    "attributes": {
      "Feature Name": "2",
      "Depth Contour Value": "2"
    }
  },
  {
    "name": "Depth contour",
    "polygons": [

    ],
    "attributes": {
      "Feature Name": "5",
      "Depth Contour Value": "5"
    }
  },
  {
    "name": "Depth area (<= 10m)",
    "polygons": [

    ],
    "attributes": {
      "Minimum Depth": "0",
      "Maximum Depth": "2"
    }
  },
  {
    "name": "Depth area (<= 10m)",
    "polygons": [

    ],
    "attributes": {
      "Minimum Depth": "5",
      "Maximum Depth": "10"
    }
  }
];

const CHART = [
  {
    "name": "0734-0",
    "polygons": [

    ],
    "attributes": {
      "Chart Number": "0734-0",
      "Title": "Firth of Forth Isle of May to Inchkeith",
      "Scale": "50000",
      "Edition Date": "2013-09-12 00:00:00+01"
    }
  },
  {
    "name": "1407-0",
    "polygons": [

    ],
    "attributes": {
      "Chart Number": "1407-0",
      "Title": "Montrose to Berwick - Upon - Tweed",
      "Scale": "200000",
      "Edition Date": "2009-05-14 00:00:00+01"
    }
  }
];

const ENVIRO = [
  {
    "name": "Land Cover Map 2007",
    "polygons": [

    ],
    "attributes": {
      "Class": "Coniferous woodland",
      "Pixel Distribution": "0,217,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,218,2",
      "Uncertainty": "250",
      "Uncertainty Standard Deviation": "21",
      "Number of Pixels": "218",
      "Proportion of Dominant Land Cover": "1"
    }
  }
];

const AERIAL = [
  {
    "name": "nt4851",
    "polygons": [
      "POLYGON((348000 651000,348000 652000,349000 652000,349000 651000,348000 651000))"
    ],
    "attributes": {
      "Date Flown": "2014-04-19"
    }
  }
];

let validate = (request) => {
  console.log('Get Feature Info request: ', request);
  if (request.service === 'WMS' &&
      request.version === '1.1.1') {
    return true;
  }

  return false;
};

let gfi = (req, res) => {
  const request = req.query
  // Validate request first.
  if (validate(request)) {
    if (request.mapper === 'geology') {
      res.json(GEOLOGY);
    } else if (request.mapper === 'historic') {
      res.json(HISTORIC);
    } else if (request.mapper === 'enviro') {
      res.json(ENVIRO);
    } else if (request.mapper === 'marine') {
      res.json(MARINE);
    } else if (request.mapper === 'chart') {
      res.json(CHART);
    } else if (request.mapper === 'aerial') {
      res.json(AERIAL);
    } else {
      // Unknown mapper, return Bad Request 400 Error.
      res.status(400)
      res.json({ message: 'Unknown mapper' });
    }
  } else {
    // Invalid request, return Bad Request 400 Error.
    res.status(400)
    res.json({ message: 'Unable to validate GFI request' });
  }
};

module.exports = {
  gfi
};
