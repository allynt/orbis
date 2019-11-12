'use strict';

const _ = require('lodash');

const mockDb = require('./mock-db/mock-db.js').mockDb;

const arrayToMap = function (ary, keyField='id') {
  let map = {};
  (ary || []).forEach(entry => {
    let id = entry[keyField];
    map[id] = entry
  });
  return map
};

const MyMapsEndpointGetAll = {
  handleRequest(req, res) {
    const myMaps = mockDb.myMaps.map(m => {
      let map = _.clone(m);
      map.annotations = null;
      return map;
    });
    const maps = _.orderBy(myMaps, ['date'], ['desc']);
    res.json(maps);
  }
};

const MyMapsEndpointSave = {
  handleRequest(req, res) {
    console.log('Saving My Map');
    if(MyMapsEndpointSave.isValidCase(req)){
      MyMapsEndpointSave.handleValidCase(req, res)
    } else {
      MyMapsEndpointSave.handleErrorCase(req, res)
    }
  },

  isValidCase(req){
    return req.body && req.body.title
  },

  handleValidCase(req, res){
    let geoMap = req.body;
    let mapOfMaps = arrayToMap(mockDb.myMaps);
    let id;
    do {
      id = Math.trunc(Math.random() * 1000000);
    } while (!!mapOfMaps[id]);
    geoMap.id = id;
    geoMap.date = Date.now();

    if(geoMap.annotations && !geoMap.annoid){
      geoMap.annoid = Math.trunc(Math.random() * 1000*1000)
    }
    mapOfMaps[id] = geoMap;

    mockDb.myMaps.push(geoMap);
    res.json({id: geoMap.id})
  },

  handleErrorCase(req, res){
    res.status(400);
    res.json([{error: {message: "Error Case"}}]);
  }
};

const MyMapsEndpointUpdate = {
  handleRequest(req, res){
    console.log('Updating My Map: ', req.params.id);
    if(MyMapsEndpointUpdate.isValidCase(req)){
      MyMapsEndpointUpdate.handleValidCase(req, res)
    } else {
      MyMapsEndpointUpdate.handleErrorCase(req, res)
    }
  },

  isValidCase(req){
    return req.body && req.body.title
  },

  handleValidCase(req, res){
    let id = req.params.id;
    let map = mockDb.myMaps.find(m => m.id === id)[0];
    map.title = req.body.title;
    res.json({});
  },

  handleErrorCase(req, res){
    res.status(400);
    res.json([{error: {message: "Error Case"}}]);
  }
};

let MyMapsEndpointDelete = {
  handleRequest(req, res){
    console.log('Deleting My Map: ', req.params.id);
    if(MyMapsEndpointDelete.isValidCase(req)){
      MyMapsEndpointDelete.handleValidCase(req, res)
    } else {
      MyMapsEndpointDelete.handleErrorCase(req, res)
    }
  },

  isValidCase(req){
    let id = req.params.id;
    return id && arrayToMap(mockDb.myMaps)[id]
  },

  handleValidCase(req, res){
    let id = parseInt(req.params.id, 10);
    let arr = mockDb.myMaps.filter(m => m.id !== id);
    mockDb.myMaps = arr;
    res.json({})
  },

  handleErrorCase(req, res){
    res.status(400);
    res.json([{error: {message: "Error Case"}}]);
  }
};

let MyMapsAnnotationGet = {
  handleRequest(req, res) {
    let id = parseInt(req.query.id, 10);
    console.log('My Maps getting annotation ' + id);
    res.json(JSON.parse(mockDb.myMaps.find(m => m.annoid === id).annotations));
  },
};

module.exports = {
  getMyMaps: MyMapsEndpointGetAll.handleRequest,
  saveMyMap: MyMapsEndpointSave.handleRequest,
  updateMyMap: MyMapsEndpointUpdate.handleRequest,
  deleteMyMap: MyMapsEndpointDelete.handleRequest,
  getAnnotation: MyMapsAnnotationGet.handleRequest,
};
