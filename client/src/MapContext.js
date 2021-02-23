import React, { createContext, useContext, useState, useRef } from 'react';

const INITIAL_VIEW_STATE = {
  zoom: 6,
  longitude: -4.84,
  latitude: 54.71,
  pitch: 0,
  bearing: 0,
};

const MapContext = createContext(undefined);
MapContext.displayName = 'MapContext';

/**
 * @typedef {Object} ViewState
 * @property {number} [longitude]
 * @property {number} [latitude]
 * @property {number} [zoom]
 * @property {number} [pitch]
 * @property {number} [bearing]
 * @property {number | 'auto'} [transitionDuration]
 * @property {*} [transitionEasing]
 * @property {*} [transitionInterpolator]
 */

/**
 * @typedef {Object} MapContextType
 * @property {React.MutableRefObject<import('react-map-gl').StaticMap>} topMapRef
 * @property {React.MutableRefObject<import('react-map-gl').StaticMap>} bottomMapRef
 * @property {React.MutableRefObject<import('@deck.gl/core').Deck>} deckRef
 * @property {ViewState} viewState
 * @property {React.Dispatch<ViewState>} setViewState
 */

/**
 * @param {React.ClassAttributes<React.Provider<MapContextType>>} props
 * @returns {JSX.Element} MapContextProvider
 */
export const MapProvider = props => {
  const topMapRef = useRef(null);
  const bottomMapRef = useRef(null);
  const deckRef = useRef(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  return (
    <MapContext.Provider
      value={{
        topMapRef,
        bottomMapRef,
        deckRef,
        viewState,
        setViewState,
      }}
      {...props}
    />
  );
};

/**
 * @returns {{
 *   topMapRef: React.MutableRefObject<import('react-map-gl').StaticMap>
 *   bottomMapRef: React.MutableRefObject<import('react-map-gl').StaticMap>
 *   deckRef: React.MutableRefObject<import('@deck.gl/core').Deck>
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
    const { deckRef, topMapRef, bottomMapRef } = context;
    const deck = deckRef.current.deck,
      topMap = topMapRef.current.getMap(),
      bottomMap = bottomMapRef.current.getMap();
    deck.redraw(true);
    const deckCanvas = deck.canvas;
    const merged = document.createElement('canvas');
    merged.width = deckCanvas.width;
    merged.height = deckCanvas.height;
    const mergedContext = merged.getContext('2d');
    mergedContext.globalAlpha = 1.0;
    mergedContext.drawImage(bottomMap.getCanvas(), 0, 0);
    mergedContext.drawImage(topMap.getCanvas(), 0, 0);
    mergedContext.globalAlpha = 1.0;
    mergedContext.drawImage(deckCanvas, 0, 0);
    merged.toBlob(callback);
  };

  return { ...context, createScreenshot };
};
