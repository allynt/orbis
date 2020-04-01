import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useMapbox = (style, accessToken, authToken) => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const viewportConfig = useSelector(state => state.map.viewport);
  const viewport = useRef(viewportConfig);

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
          if (!url.startsWith('https://api.mapbox.com')) {
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
        // used for cypress tests
        mapContainer.current.map = map;
      });

      return () => {
        viewport.current = {
          zoom: map.getZoom(),
          center: map.getCenter()
        };
        setMapInstance(null);
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            map.remove();
          });
        }
      };
    }
  }, [style, accessToken, authToken]);
  return { mapContainer, mapInstance };
};

export default useMapbox;
