import React, { createContext, useContext, useState } from 'react';

const INITIAL_VIEW_STATE = {
  zoom: 6,
  longitude: -4.84,
  latitude: 54.71,
  pitch: 0,
  bearing: 0,
};

const MapContext = createContext();
MapContext.displayName = 'MapContext';

/**
 * @typedef {Object} ViewState
 * @property {number} [longitude]
 * @property {number} [latitude]
 * @property {number} [zoom]
 * @property {number} [pitch]
 * @property {number} [bearing]
 */

/**
 * @typedef {Object} MapContextType
 * @property {mapboxgl.Map} map
 * @property {React.Dispatch<mapboxgl.Map>} setMap
 * @property {import('deck.gl').Deck} deck
 * @property {React.Dispatch<import('deck.gl').Deck>} setDeck
 * @property {ViewState} viewState
 * @property {React.Dispatch<ViewState>} setViewState
 */

/**
 * @param {React.Props} props
 * @returns {React.Provider<MapContextType>} MapContextProvider
 */
export const MapProvider = props => {
  const [map, setMap] = useState();
  const [deck, setDeck] = useState();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  return (
    <MapContext.Provider
      value={{ map, setMap, deck, setDeck, viewState, setViewState }}
      {...props}
    />
  );
};

/**
 * @returns {{
 *   map: mapboxgl.Map
 *   setMap: React.Dispatch<mapboxgl.Map>
 *   deck: import('deck.gl').Deck
 *   setDeck: React.Dispatch<import('deck.gl').Deck
 *   viewState: ViewState
 *   setViewState: React.Dispatch<ViewState>
 *   createScreenshot: (callback: BlobCallback) => void
 * }}
 */
export const useMap = () => {
  /**
   * @type {MapContextType}
   */
  const context = useContext(MapContext);

  if (context === undefined) throw Error('Wrap your app with <MapProvider />');

  /**
   * @param {BlobCallback} callback
   */
  const createScreenshot = callback => {
    const { deck, map } = context;
    deck.redraw(true);
    const deckCanvas = deck.canvas;
    let merged = document.createElement('canvas');
    merged.width = deckCanvas.width;
    merged.height = deckCanvas.height;
    const mergedContext = merged.getContext('2d');
    mergedContext.globalAlpha = 1.0;
    mergedContext.drawImage(map.getCanvas(), 0, 0);
    mergedContext.globalAlpha = 1.0;
    mergedContext.drawImage(deckCanvas, 0, 0);
    merged.toBlob(callback);
  };

  return { ...context, createScreenshot };
};
