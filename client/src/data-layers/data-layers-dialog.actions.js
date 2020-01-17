export const ADD_LAYERS = 'ADD_LAYERS';
export const REMOVE_LAYER = 'REMOVE_LAYER';

export const addLayers = layers => ({ type: ADD_LAYERS, layers });

export const removeLayer = layer => ({ type: REMOVE_LAYER, layer });
