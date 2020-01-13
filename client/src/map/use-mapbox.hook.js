import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useMapbox = (style, accessToken, authToken, authUrl) => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const viewportConfig = useSelector(state => state.map.viewport);
  const viewport = useRef(viewportConfig);
  let resolveCb;

  const mapPromise = new Promise((resolve, reject) => {
    resolveCb = resolve;
  });

  useEffect(() => {
    if (accessToken) {
      mapboxgl.accessToken = accessToken;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        ...viewport.current,
        attributionControl: false,
        preserveDrawingBuffer: true,
        transformRequest: (url, resourceType) => {
          // FIXME: This only works for a single URL, it is likely we want to
          // do this for more than one.
          if (authUrl && url.startsWith(authUrl)) {
            const request = {
              url,
              headers: { Authorization: `Bearer ${authToken}` }
            };
            return request;
          }
        }
      });

      map.on('load', () => {
        setMapInstance(map);
        resolveCb(map);
        // used for cypress tests
        mapContainer.current.map = map;
      });

      return () => {
        viewport.current = {
          zoom: map.getZoom(),
          center: map.getCenter()
        };
        setMapInstance(null);
        window.requestIdleCallback(() => {
          map.remove();
        });
      };
    }
  }, [style, accessToken, authToken]);
  return { mapContainer, mapInstance, mapPromise };
};

export default useMapbox;
