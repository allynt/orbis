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
 * @returns {MapContextType} MapContext
 */
export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) throw Error('Wrap your app with <MapProvider />');
  return context;
};
