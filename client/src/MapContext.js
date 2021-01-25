import React, { createContext, useContext, useState, useRef } from 'react';

const INITIAL_VIEW_STATE = {
  zoom: 6,
  longitude: -4.84,
  latitude: 54.71,
  pitch: 0,
  bearing: 0,
};

const ISOMETRIC_PITCH = 35;

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
 * @property {React.MutableRefObject<import('react-map-gl').StaticMap>} mapRef
 * @property {React.MutableRefObject<import('@deck.gl/core').Deck>} deckRef
 * @property {ViewState} viewState
 * @property {React.Dispatch<ViewState>} setViewState
 * @property {boolean} extrudedMode
 * @property {React.Dispatch<boolean|undefined>} setExtrudedMode
 */

/**
 * @param {{children?: React.ReactNode}} props
 * @returns {JSX.Element} MapContextProvider
 */
export const MapProvider = props => {
  const mapRef = useRef(null);
  const deckRef = useRef(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [extrudedMode, setExtrudedMode] = useState(false);

  return (
    <MapContext.Provider
      value={{
        mapRef,
        deckRef,
        viewState,
        setViewState,
        extrudedMode,
        setExtrudedMode,
      }}
      {...props}
    />
  );
};

/**
 * @returns {{
 *   mapRef: React.MutableRefObject<import('react-map-gl').StaticMap>
 *   deckRef: React.MutableRefObject<import('@deck.gl/core').Deck>
 *   viewState: ViewState
 *   setViewState: React.Dispatch<ViewState>
 *   extrudedMode: boolean
 *   toggleExtrudedMode: () => void
 *   createScreenshot: (callback: BlobCallback) => void
 * }}
 */
export const useMap = () => {
  /**
   * @type {MapContextType}
   */
  const context = useContext(MapContext);

  if (context === undefined) throw Error('Wrap your app with <MapProvider />');

  const toggleExtrudedMode = () => {
    const { extrudedMode, setExtrudedMode, viewState, setViewState } = context;
    const newExtrudedMode = !extrudedMode;
    if (newExtrudedMode === true)
      setViewState({ ...viewState, pitch: ISOMETRIC_PITCH });
    setExtrudedMode(newExtrudedMode);
  };

  /**
   * @param {BlobCallback} callback
   */
  const createScreenshot = callback => {
    const { deckRef, mapRef } = context;
    const deck = deckRef.current.deck,
      map = mapRef.current.getMap();
    deck.redraw(true);
    const deckCanvas = deck.canvas;
    const merged = document.createElement('canvas');
    merged.width = deckCanvas.width;
    merged.height = deckCanvas.height;
    const mergedContext = merged.getContext('2d');
    mergedContext.globalAlpha = 1.0;
    mergedContext.drawImage(map.getCanvas(), 0, 0);
    mergedContext.globalAlpha = 1.0;
    mergedContext.drawImage(deckCanvas, 0, 0);
    merged.toBlob(callback);
  };

  return { ...context, toggleExtrudedMode, createScreenshot };
};
