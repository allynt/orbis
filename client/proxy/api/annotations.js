'use strict';

function encodeBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

// GeoJSON test file (two polygons, one closed one open).
const TESTGEOJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            190000.99903690824,
            775000.9999721615
          ]
        },
      },
      {
        "type": "Feature",
        "properties": {
          "internal": false,
          "marker": false,
          "pointRadius": 15,
          "fontSize": "24px",
          "fontFamily": "Arial",
          "fontColor": "#000000",
          "fontWeight": "bold",
          "textBold": true,
          "textItalics": false,
          "textUnderlined": false,
          "strokeColor": "#800080",
          "strokeOpacity": 1,
          "strokeStyle": "solid",
          "strokeWidth": 3,
          "strokeLinecap": "round",
          "labelHaloColor": "#FFFFFF",
          "labelHaloWidth": 4,
          "labelAlign": "lb",
          "alignment": 8,
          "labelXOffset": 18,
          "labelYOffset": 18,
          "fcode": 2
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              190999.99903690824,
              775999.9999721615
            ],
            [
              254999.99988659294,
              853999.9999595116
            ],
            [
              298999.99996326875,
              795999.9999592102
            ]
          ]
        },
        "id": "OpenLayers_Feature_Vector_462"
      },
      {
        "type": "Feature",
        "properties": {
          "internal": false,
          "marker": false,
          "pointRadius": 15,
          "fontSize": "24px",
          "fontFamily": "Arial",
          "fontColor": "#000000",
          "fontWeight": "bold",
          "textBold": true,
          "textItalics": false,
          "textUnderlined": false,
          "strokeColor": "#800080",
          "strokeOpacity": 1,
          "strokeStyle": "solid",
          "strokeWidth": 3,
          "strokeLinecap": "round",
          "labelHaloColor": "#FFFFFF",
          "labelHaloWidth": 4,
          "labelAlign": "lb",
          "alignment": 8,
          "labelXOffset": 18,
          "labelYOffset": 18,
          "fillColor": "#CC99FF",
          "fillOpacity": 0.4,
          "fcode": 3
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                446999.99997115094,
                793999.9999593159
              ],
              [
                488999.9999742564,
                851999.9999595592
              ],
              [
                591000.0005125065,
                827999.9999644022
              ],
              [
                539000.0000240592,
                751999.9999577753
              ],
              [
                446999.99997115094,
                793999.9999593159
              ]
            ]
          ]
        },
        "id": "OpenLayers_Feature_Vector_493"
      }
    ],
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:27700"
      }
    }
  };

// Two points in a CSV file
const TESTCSV =
  `"WptName","GR(6)","Hill Name","GridEast","GridNorth","Latitude","Longitude","Climbed?","Easting","Northing"
  "0936.m","NN660776","A'Bhuidheanach Bheag","66069","77600","56.870399","-4.198839","","266069","777600"
  "0997.M","NH136714","A'Chailleach","13620","71414","57.693782","-5.12873","","213620","871414"`;

// Example of GeoJSON returned after GPX file has been converted
const TESTGPX = {
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::27700"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Route7",
        "cmt": null,
        "desc": null,
        "src": null,
        "link1_href": null,
        "link1_text": null,
        "link1_type": null,
        "link2_href": null,
        "link2_text": null,
        "link2_type": null,
        "number": null,
        "type": "Route"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            338570.1426858166,
            516994.89820569695
          ],
          [
            338315.1407793247,
            516914.8935859313
          ],
          [
            338247.6400472547,
            516937.39316046145
          ],
        ]
      }
    }
  ]
};

/**
 * While upload will always return the same data (supplied above) this will vary depending
 * on the mimetype of the request file:
 *  - CSV file -> TESTCSV returned
 *  - JSON file -> GeoJSON returned
 *  - GPX file -> TESTGPX returned
 *  - anything else -> error
 */
const uploadAnnotations = (req, res) => {
  if (req.file.mimetype === 'text/csv') {
    res.json({
      base64EncodedBody: encodeBase64(TESTCSV),
      format: 'csv',
      message: 'GIS translation successful',
      'output-format': 'csv',
      projection: 'British National Grid',
      success: true,
      'translation-success': true,
    });
  } else if (req.file.mimetype === 'application/octet-stream') {
    res.json({
      base64EncodedBody: encodeBase64(JSON.stringify(TESTGPX)),
      format: 'gpx',
      message: 'GIS translation successful',
      'output-format': 'geojson',
      projection: 'WGS84',
      success: true,
      'translation-success': true,
    });
  } else if (req.file.mimetype === 'application/json') {
    res.json({
      base64EncodedBody: encodeBase64(JSON.stringify(TESTGEOJSON)),
      format: 'geojson',
      message: 'GIS translation successful',
      'output-format': 'geojson',
      projection: 'British National Grid',
      success: true,
      'translation-success': true,
    });
  } else {
    res.json({
      base64EncodedBody: '',
      format: 'geojson',
      message: 'Unknown input format. Please see the the Help pages for information about supported formats.',
      messageCode: null,
      messageArguments: null,
      'output-format': 'geojson',
      projection: 'British National Grid',
      success: true,
      'translation-success': false,
    });
  }
};

const exportAnnotations = (req, res) => {
  console.log('exportAnnotations body: ', req.body);
  if (req.body.filename === 'error') {
    res.status(400);
    res.json([{error: { message: 'exportAnnotations error' }}]);
  } else {
    res.send('mapper_3338627661984581814.zip');
  }
}

module.exports = {
  uploadAnnotations,
  exportAnnotations,
};
