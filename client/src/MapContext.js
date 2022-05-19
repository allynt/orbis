import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';

const INITIAL_VIEW_STATE = {
  zoom: 6,
  longitude: -4.84,
  latitude: 54.71,
  pitch: 0,
  bearing: 0,
};

export const MapContext = createContext(undefined);
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
 * @property {React.MutableRefObject<import('@deck.gl/core').Deck>} topDeckRef
 * @property {React.MutableRefObject<import('@deck.gl/core').Deck>} bottomDeckRef
 * @property {ViewState} viewState
 * @property {React.Dispatch<ViewState>} setViewState
 * @property {(newViewState: ViewState) => void} updateViewState
 */

/**
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element} MapContextProvider
 */
export const MapProvider = ({ value, ...rest }) => {
  const topMapRef = useRef(null);
  const bottomMapRef = useRef(null);
  const topDeckRef = useRef(null);
  const bottomDeckRef = useRef(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  /**
   * @param {ViewState} newViewState
   */
  const updateViewState = useCallback(
    newViewState =>
      setViewState(currentViewState => ({
        ...currentViewState,
        ...newViewState,
      })),
    [],
  );

  return (
    <MapContext.Provider
      value={{
        topMapRef,
        bottomMapRef,
        topDeckRef,
        bottomDeckRef,
        viewState,
        setViewState,
        updateViewState,
        ...value,
      }}
      {...rest}
    />
  );
};

/**
 * @returns {{
 *   topMapRef: React.MutableRefObject<import('react-map-gl').StaticMap>
 *   bottomMapRef: React.MutableRefObject<import('react-map-gl').StaticMap>
 *   topDeckRef: React.MutableRefObject<import('@deck.gl/core').Deck>
 *   bottomDeckRef: React.MutableRefObject<import('@deck.gl/core').Deck>
 *   viewState: ViewState
 *   setViewState: React.Dispatch<ViewState>
 *   updateViewState: (newViewState: ViewState) => void
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
    const { bottomDeckRef, topDeckRef, topMapRef, bottomMapRef } = context;
    const topDeck = topDeckRef.current.deck,
      bottomDeck = bottomDeckRef.current.deck,
      topMap = topMapRef.current.getMap(),
      bottomMap = bottomMapRef.current.getMap();
    topDeck.redraw(true);
    bottomDeck.redraw(true);
    const topDeckCanvas = topDeck.canvas;
    const bottomDeckCanvas = bottomDeck.canvas;
    const merged = document.createElement('canvas');
    merged.width = bottomDeckCanvas.width;
    merged.height = bottomDeckCanvas.height;
    const mergedContext = merged.getContext('2d');
    mergedContext.drawImage(bottomMap.getCanvas(), 0, 0);
    mergedContext.drawImage(bottomDeckCanvas, 0, 0);
    mergedContext.drawImage(topMap.getCanvas(), 0, 0);
    mergedContext.drawImage(topDeckCanvas, 0, 0);
    merged.toBlob(callback);
  };

  return { ...context, createScreenshot };
};
