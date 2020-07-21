import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();
MapContext.displayName = 'MapContext';

/**
 * @typedef {Object} MapContextType
 * @property {mapboxgl.Map} map
 * @property {React.Dispatch<mapboxgl.Map>} setMap
 * @property {import('deck.gl').Deck} deck
 * @property {React.Dispatch<import('deck.gl').Deck>} setDeck
 */

/**
 * @param {React.Props} props
 * @returns {React.Provider<MapContextType>} MapContextProvider
 */
export const MapProvider = props => {
  const [map, setMap] = useState();
  const [deck, setDeck] = useState();
  return (
    <MapContext.Provider value={{ map, setMap, deck, setDeck }} {...props} />
  );
};

/**
 * @returns {{
 *   map: mapboxgl.Map
 *   setMap: React.Dispatch<mapboxgl.Map>
 *   deck: import('deck.gl').Deck
 *   setDeck: React.Dispatch<import('deck.gl').Deck>
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
