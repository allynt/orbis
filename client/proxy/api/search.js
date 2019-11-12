'use strict';

const util = require('../util.js');

let noResults = [];

let singleResult = [{
  name: 'EH9 1PR',
  searchResultType:"POSTCODE",
  point: {
    x: 326351,
    y: 672165,
  }
}];

let multipleResults = [
  {
    name: 'Edinburgh',
    searchResultType:"PLACENAME",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType:"PLACENAME",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Caisteal Dhùn Èideann',
    searchResultType:"PLACENAME",
    point: {
      x: 33600,
      y: 67500,
    }
  }
];

let multipleResultsLong = [
  {
    name: 'Edinburgh (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 327500,
      y: 673500,
    }
  }, {
    name: 'Gracemount (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 327500,
      y: 668500,
    }
  }, {
    name: 'Cockburn (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 314500,
      y: 665500,
    }
  }, {
    name: 'Balerno (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 316500,
      y: 666500,
    }
  }, {
    name: 'Newcraighall (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 332500,
      y: 671500,
    }
  }, {
    name: 'Haugh (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 311500,
      y: 67250,
    }
  }, {
    name: 'Cockdurno (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 315500,
      y: 664500,
    }
  }, {
    name: 'Ashley (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 315500,
      y: 671500,
    }
  }, {
    name: 'Pilton (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 323500,
      y: 676500,
    }
  }, {
    name: 'Whitemoss (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 311500,
      y: 665500,
    }
  }, {
    name: 'Rosebank (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 318500,
      y: 667500,
    }
  }, {
    name: 'Newhaven (Edinburgh)',
    searchResultType:"PLACENAME",
    point: [325500, 677500]
  }, {
    name: 'Lymphoy (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 317500,
      y: 667500,
    }
  }, {
    name: 'Hermiston (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 317500,
      y: 670500,
    }
  }, {
    name: 'Comiston (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 324500,
      y: 668500,
    }
  }, {
    name: 'Gowanhill (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 316500,
      y: 668500,
    }
  }, {
    name: 'Listonshiels (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 313500,
      y: 661500,
    }
  }, {
    name: 'Leuchold (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 315500,
      y: 678500,
    }
  }, {
    name: 'Muirhouse (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 321500,
      y: 676500,
    }
  }, {
    name: 'Pilrig (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 326500,
      y: 675500,
    }
  }, {
    name: 'Summerside (Edinburgh)',
    searchResultType:"PLACENAME",
    point: {
      x: 331500,
      y: 668500,
    }
  }
];

let edinburghResult = [{
  name: 'Edinburgh',
  searchResultType:"PLACENAME",
  point: {
    x: 325763,
    y: 673884,
  }
}];

let error = [{
  message: 'Error Searching',
  data: [{
    search: 'Search term',
    bbox: [0,0,0,0],
    resolution: 100.0
  }]
}];

let postcodes = [
  {
    name: 'Edinburgh',
    searchResultType:"POSTCODE",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType:"POSTCODE",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Caisteal Dhùn Èideann',
    searchResultType:"POSTCODE",
    point: {
      x: 33600,
      y: 67500,
    }
  }
];

let placenames = [
  {
    name: 'Edinburgh',
    searchResultType:"PLACENAME",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType:"PLACENAME",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Caisteal Dhùn Èideann',
    searchResultType:"PLACENAME",
    point: {
      x: 33600,
      y: 67500,
    }
  }
];

let gridReferences = [
  {
    name: 'Edinburgh',
    searchResultType: "GRIDREF_AB0",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType: "GRIDREF_AB2",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Edinburgh',
    searchResultType: "GRIDREF_AB4",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType: "GRIDREF_AB6",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'London',
    searchResultType: "GRIDREF_AB8",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Caisteal Dhùn Èideann',
    searchResultType:"GRIDREF_AB10",
    point: {
      x: 33600,
      y: 67500,
    }
  }
];

let epsg = [
  {
    name: 'Edinburgh',
    searchResultType:"EPSG_27700",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType:"EPSG_27700",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Caisteal Dhùn Èideann',
    searchResultType:"EPSG_27700",
    point: {
      x: 33600,
      y: 67500,
    }
  }
];

let wgs = [
  {
    name: 'Edinburgh',
    searchResultType:"WGS_84",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType:"WGS_84",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Caisteal Dhùn Èideann',
    searchResultType:"WGS_84",
    point: {
      x: 33600,
      y: 67500,
    }
  }
];

let rads = [
  {
    "point": {
      "x": 530093,
      "y": 179914
    },
    "searchResultType": "ROAD",
    "name": "Downing Street (St James's - London)"
  },
  {
    "point": {
      "x": 534239,
      "y": 186087
    },
    "searchResultType": "ROAD",
    "name": "Ottaway Street (Hackney Downs - London)"
  },
  {
    "point": {
      "x": 533666,
      "y": 183441
    },
    "searchResultType": "ROAD",
    "name": "How's Street (Haggerston - London)"
  },
];

let mixed = [
  {
    name: "Downing Street (St James's - London)",
    searchResultType: "ROAD",
    point: {
      "x": 530093,
      "y": 179914
    }
  }, {
    name: "Ottaway Street (Hackney Downs - London)",
    searchResultType: "ROAD",
    point: {
      "x": 534239,
      "y": 186087
    }
  }, {
    name: "How's Street (Haggerston - London)",
    searchResultType: "ROAD",
    point: {
      "x": 533666,
      "y": 183441
    }
  }, {
    name: 'WGS-Edinburgh',
    searchResultType:"WGS_84",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'PN-London',
    searchResultType:"PLACENAME",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'EPSG-Edinburgh',
    searchResultType:"EPSG_27700",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'Edinburgh',
    searchResultType: "GRIDREF_AB0",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType: "GRIDREF_AB2",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Edinburgh',
    searchResultType: "GRIDREF_AB4",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'London',
    searchResultType: "GRIDREF_AB6",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'London',
    searchResultType: "GRIDREF_AB8",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'Caisteal Dhùn Èideann',
    searchResultType: "GRIDREF_AB10",
    point: {
      x: 33600,
      y: 67500,
    }
  }, {
    name: 'WGS-Edinburgh',
    searchResultType:"WGS_84",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'WGS-Caisteal Dhùn Èideann',
    searchResultType:"WGS_84",
    point: {
      x: 33600,
      y: 67500,
    }
  }, {
    name: 'EPSG-London',
    searchResultType:"EPSG_27700",
    point: {
      x: 532475,
      y: 180740.}
  }, {
    name: 'GR-Edinburgh',
    searchResultType:"GRIDREF_AB6",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'PC-London',
    searchResultType:"POSTCODE",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'WGS-Caisteal Dhùn Èideann',
    searchResultType:"WGS_84",
    point: {
      x: 33600,
      y: 67500,
    }
  }, {
    name: 'GR-London',
    searchResultType:"GRIDREF_AB6",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'PN-Edinburgh',
    searchResultType:"PLACENAME",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'WGS-London',
    searchResultType:"WGS_84",
    point: {
      x:532475,
      y: 180740,
    }
  }, {
    name: 'EPSG-London',
    searchResultType:"EPSG_27700",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'PN-Caisteal Dhùn Èideann',
    searchResultType:"PLACENAME",
    point: {
      x: 33600,
      y: 67500,
    }
  }, {
    name: 'PC-Edinburgh',
    searchResultType:"POSTCODE",
    point: {
      x: 325763,
      y: 673884,
    }
  }, {
    name: 'WGS-London',
    searchResultType:"WGS_84",
    point: {
      x: 532475,
      y: 180740,
    }
  }, {
    name: 'PC-Caisteal Dhùn Èideann',
    searchResultType:"POSTCODE",
    point: {
      x: 33600,
      y: 67500,
    }
  }, {
    name: 'EPSG-Caisteal Dhùn Èideann',
    searchResultType:"EPSG_27700",
    point: {
      x: 33600,
      y: 67500,
    }
  }
];

let search = (req, res) =>{
  console.log('SEARCHING for ' + req.query.term);

  util.wait(1000);

  let searchTerm = req.query.term.toUpperCase();

  if (searchTerm === 'ZERO') {
    res.json(noResults);
  } else if (searchTerm === 'EH9 1PR') {
    res.json(singleResult);
  } else if (searchTerm === 'MULTI') {
    res.json(multipleResults);
  } else if (searchTerm === 'MULTILONG') {
    res.json(multipleResultsLong);
  } else if (searchTerm === 'EDINBURGH') {
    res.json(edinburghResult);
  } else if (searchTerm === 'PC') {
    res.json(postcodes);
  } else if (searchTerm === 'PN') {
    res.json(placenames);
  } else if (searchTerm === 'GR') {
    res.json(gridReferences);
  } else if (searchTerm === 'EPSG') {
    res.json(epsg);
  } else if (searchTerm === 'WGS') {
    res.json(wgs);
  } else if (searchTerm === 'MIXED') {
    res.json(mixed);
  } else if (searchTerm === 'ERROR') {
    res.status(400);
    res.json(error);
  } else {
    res.json(noResults);
  }
};

module.exports = {
  search
};
