
let fs = require('fs');

/**
 * Incredibly non-robust pseudo database for ensuring that loading a map and then loading annotations behaves
 * as expected, without requiring hard-coded "dev only" workflow oddities in the app code itself.
 *
 * Used by my-maps and annotations endpoints.
 *
 */

function loadGeoJSON(name) {
  let filename = __dirname + '/geojson/' + name + '.json';
  console.log('loading: ' + filename);
  return fs.readFileSync(filename, { encoding: 'utf8' });
}

function loadXml(name) {
  let filename = __dirname + '/xml/' + name + '.xml';
  return fs.readFileSync(filename, { encoding: 'utf8' });
}

const mockDb = {
  myMaps: [
    {
      "id": 317045,
      "username": "edi:test",
      "title": "asdfasfas",
      "view": "Shire View 2",
      "date": 1494929700498,
      "product": "1980",
      "productDisplayName": "1980",
      "resolution": 5.3,
      "layers": "",
      "annotations": null,
      "centreX": 534500.0,
      "centreY": 172500.0,
      "client": "historic",
      "annoid": null,
      "projection": "EPSG:27700",
      "formattedDate": "2017-05-16 11:15:00.498"
    },
    {
      "id": 317045,
      "username": "edi:test",
      "title": "Plus this has to be a really long name for ie11",
      "view": "Metropolitan",
      "date": 1494929700498,
      "product": "aerial_rgb25cm",
      "productDisplayName": "Aerial imagery (25cm resolution)",
      "resolution": 25,
      "layers": "",
      "annotations": null,
      "centreX": 534500.0,
      "centreY": 172500.0,
      "client": "aerial",
      "annoid": null,
      "projection": "EPSG:27700",
      "formattedDate": "2017-05-16 11:15:00.498"
    },
    {
      "id": 47554,
      "username": "edi:test",
      "title": "tester",
      "view": "Division",
      "date": 1274366656403,
      "product": "Geology50k",
      "productDisplayName": "1:50 000 Geology",
      "resolution": 26.458,
      "layers": "",
      "annotations": null,
      "centreX": 324229.908,
      "centreY": 616239.592,
      "client": "geology",
      "annoid": null,
      "projection": "EPSG:27700",
      "formattedDate": "2010-05-20 15:44:16.403"
    },
    {
      "id": 9203,
      "username": "edi:test",
      "title": "MyTestMapWithAnnotations",
      "view": "Metropolitan View",
      "date": 1497453945491,
      "product": "Strategi",
      "productDisplayName": "Strategi",
      "resolution": 50.0,
      "layers": "ST_all",
      "annotations": loadGeoJSON('circle-line'),
      "centreX": 337307.0,
      "centreY": 665918.37678571,
      "client": "os",
      "annoid": 1000,
      "projection": "EPSG:27700",
      "formattedDate": "2017-06-14 16:25:45.491"
    },
    {
      "id": 317050,
      "username": "edi:test",
      "title": "Annotations-noth-uist",
      "view": "Metropolitan View",
      "date": 1497453945491,
      "product": "Strategi",
      "productDisplayName": "Strategi",
      "resolution": 50.0,
      "layers": "ST_all",
      "annotations": loadGeoJSON('north_uist_all_annotations'),
      "centreX": 84534,
      "centreY": 869778,
      "client": "os",
      "annoid": 1001,
      "projection": "EPSG:27700",
      "formattedDate": "2017-06-14 16:25:45.491"
    },
    {
      "id": 317050,
      "username": "edi:test",
      "title": "Annotations-3857",
      "view": "District View",
      "date": 1497453945491,
      "product": "Strategi",
      "productDisplayName": "Strategi",
      "resolution": 10.0,
      "layers": "ST_all",
      "annotations": loadGeoJSON('epsg-3857'),
      "centreX": 119563,
      "centreY": 655884,
      "client": "os",
      "annoid": 1002,
      "projection": "EPSG:3857",
      "formattedDate": "2017-06-14 16:25:45.491"
    },
  ]
};

module.exports = {
  mockDb,
  loadGeoJSON,
  loadXml,
};
