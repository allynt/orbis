import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();
MapContext.displayName = 'MapContext';

/**
 * @typedef {Object} MapContextType
 * @property {mapboxgl.Map} map
 * @property {React.Dispatch<mapboxgl.Map>} setMap
 */

/**
 * @param {React.Props} props
 * @returns {React.Provider<MapContextType>} MapContextProvider
 */
export const MapProvider = props => {
  const [map, setMap] = useState();
  return <MapContext.Provider value={{ map, setMap }} {...props} />;
};

/**
 * @returns {MapContextType} MapContext
 */
export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) throw Error('Wrap your app with <MapProvider />');
  return context;
};
