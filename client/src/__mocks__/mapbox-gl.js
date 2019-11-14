import { act } from '@testing-library/react';

let events = {};
let layerEvents = {};

export default {
  Map: jest.fn().mockImplementation(() => {
    return {
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
      addControl: jest.fn(),
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
      getStyle: jest.fn(() => ({
        layers: []
      })),
      _controls: []
    };
  })
};
export const ScaleControl = jest.fn();
export const AttributionControl = jest.fn();
export const NavigationControl = jest.fn();
export const fireMapEvent = (event, layer, data) => {
  act(() => {
    if (data) {
      events[event][layer].forEach(cb => cb(data));
      events[event][layer] = [];
    } else {
      events[event].forEach(cb => cb(layer));
      events[event] = [];
    }
  });
};
