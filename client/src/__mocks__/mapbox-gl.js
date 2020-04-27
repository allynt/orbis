import { act } from '@testing-library/react';

let events = {};
let layerEvents = {};
let _controls = [];

export default {
  Map: jest.fn().mockImplementation(() => {
    return {
      _controls,
      on: jest.fn((event, layer, fn) => {
        if (fn) {
          layerEvents[event] = events[event] || {};
          layerEvents[event][layer] = layerEvents[event][layer] || [];
          layerEvents[event][layer].push(fn);
        } else {
          events[event] = events[event] || [];
          events[event].push(layer);
        }
      }),
      off: jest.fn(),
      setPaintProperty: jest.fn(),
      setLayoutProperty: jest.fn(),
      addControl: jest.fn(ctrl => (_controls = [..._controls, ctrl])),
      remove: jest.fn(),
      removeControl: jest.fn(),
      resize: jest.fn(),
      addSource: jest.fn(),
      addLayer: jest.fn(),
      setFilter: jest.fn(),
      easeTo: jest.fn(),
      getLayer: jest.fn(),
      removeLayer: jest.fn(),
      getZoom: jest.fn(),
      getCenter: jest.fn(),
      getBounds: jest.fn(() => ({
        getNorthWest: jest.fn(() => ({ lng: 0, lat: 0 })),
        getNorthEast: jest.fn(() => ({ lng: 0, lat: 0 })),
        getSouthEast: jest.fn(() => ({ lng: 0, lat: 0 })),
        getSouthWest: jest.fn(() => ({ lng: 0, lat: 0 })),
      })),
      getStyle: jest.fn(() => ({
        layers: [],
      })),
    };
  }),
};
export const ScaleControl = jest.fn();
export const AttributionControl = jest.fn();
export const NavigationControl = jest.fn();
export const fireMapEvent = (event, layer, data) => {
  act(() => {
    console.log('EVENTS: ', events);
    if (data) {
      events[event][layer].forEach(cb => cb(data));
      events[event][layer] = [];
    } else {
      events[event].forEach(cb => cb(layer));
      events[event] = [];
    }
  });
};
