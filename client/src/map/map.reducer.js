import { regions, domains } from './map.constants';

import {
  TOGGLE_3D_MODE,
  TOGGLE_MULTI_MODE,
  TOGGLE_MINI_MAP,
  TOGGLE_SPYGLASS,
  TOGGLE_COMPARE,
  MAP_STYLE_SELECTED,
  TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY,
  TOGGLE_CUSTOM_LAYER_VISIBILITY,
  INFRASTRUCTURE_DATA_REQUESTED_SUCCESS,
  INFRASTRUCTURE_DATA_REQUESTED_FAILURE,
  CUSTOM_DATA_REQUESTED_SUCCESS,
  CUSTOM_DATA_REQUESTED_FAILURE,
  SOURCE_DATA_AND_TOKEN_REQUESTED_SUCCESS,
  SOURCE_DATA_AND_TOKEN_REQUESTED_FAILURE,
  SET_VIEWPORT,
  SAVE_MAP
} from './map.actions';

const initialState = {
  viewport: { zoom: 6, center: [-4.84, 54.71] },
  mapStyles: [],
  selectedMapStyle: {},
  isMultiMapMode: false,
  is3DMode: false,
  infrastructureLayers: [],
  customLayers: [],
  isMiniMapVisible: false,
  isSpyglassMapVisible: false,
  isCompareMode: false,
  domains,
  regions,
  pollingPeriod: 30000,
  dataToken: null,
  dataSources: null,
  saveMap: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEWPORT:
      return action.viewport ? { ...state, viewport: action.viewport } : state;

    case MAP_STYLE_SELECTED:
      return { ...state, selectedMapStyle: action.mapStyle };

    case TOGGLE_MULTI_MODE:
      return { ...state, isMultiMapMode: !state.isMultiMapMode };

    case TOGGLE_3D_MODE:
      return { ...state, is3DMode: !state.is3DMode };

    case TOGGLE_MINI_MAP:
      return { ...state, isMiniMapVisible: !state.isMiniMapVisible };

    case TOGGLE_SPYGLASS:
      return { ...state, isSpyglassMapVisible: !state.isSpyglassMapVisible };

    case TOGGLE_COMPARE:
      return { ...state, isCompareMode: !state.isCompareMode };

    case TOGGLE_INFRASTRUCTURE_LAYER_VISIBILITY:
      // Toggle whether layer is visible or not.
      const infrastructureLayers = state.infrastructureLayers.map(layer => {
        if (layer.id === action.layer) {
          return {
            ...layer,
            visible: !layer.visible
          };
        } else {
          return layer;
        }
      });

      return {
        ...state,
        infrastructureLayers
      };

    case TOGGLE_CUSTOM_LAYER_VISIBILITY:
      // Toggle whether layer is visible or not.
      const customLayers = state.customLayers.map(layer =>
        layer.id === action.layer
          ? {
              ...layer,
              visible: !layer.visible
            }
          : layer
      );

      return {
        ...state,
        customLayers
      };

    case INFRASTRUCTURE_DATA_REQUESTED_SUCCESS:
      return { ...state, infrastructureLayers: action.layers };
    case INFRASTRUCTURE_DATA_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case CUSTOM_DATA_REQUESTED_SUCCESS:
      return { ...state, customLayers: action.layers };
    case CUSTOM_DATA_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case SOURCE_DATA_AND_TOKEN_REQUESTED_SUCCESS:
      // Convert from minutes to millliseconds and then half the value.
      // This will ensure we update the token before it expires.
      const timeoutInMilliseconds = (action.sourcesAndToken.timeout * 60 * 1000) / 2;

      return {
        ...state,
        dataToken: action.sourcesAndToken.token,
        dataSources: action.sourcesAndToken.sources,
        pollingPeriod: timeoutInMilliseconds
      };
    case SOURCE_DATA_AND_TOKEN_REQUESTED_FAILURE:
      return { ...state, error: action.error };

    case SAVE_MAP:
      return { ...state, saveMap: !state.saveMap };

    default:
      return state;
  }
};

export default reducer;
