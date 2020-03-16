import React, { useState } from 'react';

import * as FileSaver from 'file-saver';
import mapboxgl, { AttributionControl, NavigationControl, ScaleControl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import { useDispatch, useSelector } from 'react-redux';

import useMapbox from './use-mapbox.hook';
import useMap from './use-map.hook';
import useMapControl from './use-map-control.hook';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useMapEvent } from './use-map-event.hook';
import MapStyleSwitcher from '../mapstyle/mapstyle-switcher.component';
import { MAP_STYLE_SELECTED, setViewport, saveMap } from './map.actions';
import { closeMenu } from '../side-menu/side-menu.actions';
import { isLoaded } from '../bookmarks/bookmarks.actions';
import SideMenu from '../side-menu/side-menu.component';
import AnnotationsPanel from '../annotations/annotations-panel.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import DataLayers from '../data-layers/data-layers.component';
import SatellitesPanel from '../satellites/satellites-panel.component';
import Profile from '../accounts/profile.component';
import PasswordChangeForm from '../accounts/password-change-form.component';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import LoadMask from '@astrosat/astrosat-ui/dist/load-mask/load-mask';
import CloseButton from '@astrosat/astrosat-ui/dist/buttons/close-button';
import { ReactComponent as DataIcon } from '../mapstyle/layers.svg';

import RotateMode from 'mapbox-gl-draw-rotate-mode';
import RadiusMode from '../annotations/modes/radius';
import LineMode from '../annotations/modes/line';
import PolygonMode from '../annotations/modes/polygon';
import FreehandPolygonMode from '../annotations/modes/freehand-polygon';
import CircleMode from '../annotations/modes/circle';
import LabelMode from '../annotations/modes/label';
import ImageMode from '../annotations/modes/image';
import RectangleMode from '../annotations/modes/rectangle';
import {
  ANNOTATIONS,
  BOOKMARKS,
  DATA_LAYERS,
  SATELLITE_LAYERS,
  PROFILE,
  CHANGE_PASSWORD
} from '../toolbar/toolbar-constants';
import { GEOJSON, RASTER, VECTOR } from './map.constants';
import dark from '../mapstyle/dark.png';
import darkWebP from '../mapstyle/dark.webp';
import light from '../mapstyle/light.png';
import lightWebP from '../mapstyle/light.webp';
import streets from '../mapstyle/streets.png';
import streetsWebP from '../mapstyle/streets.webp';
import satellite from '../mapstyle/satellite.png';
import satelliteWebP from '../mapstyle/satellite.webp';

import drawStyles from '../annotations/styles';
import layoutStyles from './map-layout.module.css';

const Map = ({
  style = 'mapbox://styles/mapbox/satellite-v9',
  attribution = true,
  geocoder = true,
  navigation = true,
  scale = true,
  draw = true,
  layoutInvalidation,
  position,
  sidebar = false,
  setMap
}) => {
  const accessToken = useSelector(state => (state.app.config ? state.app.config.mapbox_token : null));
  const dataAuthToken = useSelector(state => state.map.dataToken);
  const dataAuthHost = useSelector(state => (state.app.config ? state.app.config.dataUrl : ''));
  const { mapContainer, mapInstance, mapPromise } = useMapbox(style, accessToken, dataAuthToken, dataAuthHost);

  if (setMap) setMap(mapInstance);

  const [isMapStyleSwitcherVisible, setIsMapStyleSwitcherVisible] = useState(false);
  const mapStyles = useSelector(state => state.map.mapStyles);
  const selectedMapStyle = useSelector(state => state.map.selectedMapStyle);
  let selectedMapStyleIcon = null;
  let selectedMapStyleIconWebP = null;
  if (selectedMapStyle.id === 'dark') {
    selectedMapStyleIcon = dark;
    selectedMapStyleIconWebP = darkWebP;
  } else if (selectedMapStyle.id === 'light') {
    selectedMapStyleIcon = light;
    selectedMapStyleIconWebP = lightWebP;
  } else if (selectedMapStyle.id === 'streets') {
    selectedMapStyleIcon = streets;
    selectedMapStyleIconWebP = streetsWebP;
  } else if (selectedMapStyle.id === 'satellite') {
    selectedMapStyleIcon = satellite;
    selectedMapStyleIconWebP = satelliteWebP;
  }
  const selectMapStyle = mapStyle => dispatch({ type: MAP_STYLE_SELECTED, mapStyle });

  const isSaveMap = useSelector(state => state.map.saveMap);

  const selectedBookmark = useSelector(state => state.bookmarks.selectedBookmark);
  const isLoading = useSelector(state => state.bookmarks.isLoading);

  const dataSources = useSelector(state => state.map.dataSources);

  const allLayers =
    dataSources &&
    dataSources.reduce((acc, value) => {
      acc = Array.from(new Set([...acc, ...value.layers]));
      return acc;
    }, []);
  const selectedLayers = useSelector(state => state.dataLayers.layers);
  const nonSelectedLayers = allLayers && allLayers.filter(layer => !selectedLayers.includes(layer));
  const scenes = useSelector(state => state.satellites.scenes);
  const selectedScene = useSelector(state => state.satellites.selectedScene);

  const dispatch = useDispatch();

  useMapControl(mapInstance, attribution, AttributionControl);
  useMapControl(mapInstance, navigation, NavigationControl, 'bottom-right');
  useMapControl(mapInstance, scale, ScaleControl);
  useMapControl(mapInstance, geocoder, MapboxGeocoder, 'top-right', {
    accessToken: accessToken,
    reverseGeocode: true,
    mapboxgl
  });
  useMapControl(mapInstance, draw, MapboxDraw, 'top-left', {
    displayControlsDefault: false,
    userProperties: true,
    styles: drawStyles,
    modes: {
      ...MapboxDraw.modes,
      RotateMode,
      RadiusMode,
      LineMode,
      PolygonMode,
      FreehandPolygonMode,
      CircleMode,
      LabelMode,
      ImageMode,
      RectangleMode
    }
  });

  useMap(
    mapInstance,
    map => {
      const timer = setTimeout(() => {
        map.resize();
      }, 0);
      return () => clearTimeout(timer);
    },
    [layoutInvalidation]
  );

  useMapEvent(
    mapInstance,
    'move',
    () => {
      const viewport = {
        center: mapInstance.getCenter(),
        zoom: mapInstance.getZoom()
      };
      dispatch(setViewport(viewport));
    },
    []
  );

  useMap(
    mapInstance,
    map => {
      const drawCtrl = mapInstance._controls.find(ctrl => ctrl.changeMode);
      drawCtrl.deleteAll();

      if (selectedBookmark) {
        map.setCenter(selectedBookmark.center);
        map.setZoom(selectedBookmark.zoom);
        drawCtrl.add(selectedBookmark.feature_collection);
        dispatch(isLoaded());
      }
    },
    [selectedBookmark]
  );

  useMap(
    mapInstance,
    map => {
      if (isSaveMap) {
        map.getCanvas().toBlob(blob => {
          FileSaver.saveAs(blob, 'snapshot.png');

          dispatch(saveMap());
        });
      }
    },
    [isSaveMap, saveMap]
  );

  useMap(
    mapInstance,
    map => {
      if (nonSelectedLayers) {
        nonSelectedLayers.forEach(layer => {
          const sourceId = `${layer.name}-source`;
          const mapStyle = map.getStyle();
          if (mapStyle) {
            const layers = map.getStyle().layers;
            let layersToRemove = [];
            nonSelectedLayers.forEach(nonSelectedLayer => {
              layers.forEach(layer => {
                if (layer.id.startsWith(nonSelectedLayer.name)) {
                  layersToRemove = [...layersToRemove, layer];
                }
              });
            });

            if (map.getSource(sourceId)) {
              layersToRemove.forEach(layer => map.removeLayer(layer.id));
              map.removeSource(sourceId);
            }
          }
        });
      }
    },
    [nonSelectedLayers]
  );

  useMap(
    mapInstance,
    map => {
      selectedLayers.forEach(layer => {
        const sourceId = `${layer.name}-source`;
        if (!map.getSource(sourceId)) {
          if (layer.type.toLowerCase() === RASTER) {
            map.addSource(sourceId, {
              type: layer.type,
              tiles: [layer.metadata.url],
              scheme: 'tms'
            });

            map.addLayer({ id: `${layer.name}-layer`, type: layer.type, source: sourceId, layout: {}, paint: {} });
          } else if (layer.type.toLowerCase() === VECTOR) {
            map.addSource(sourceId, {
              type: layer.type,
              tiles: [layer.metadata.url]
            });

            map.addLayer({
              id: `${layer.name}-layer`,
              type: 'fill',
              source: sourceId,
              'source-layer': layer.name,
              layout: {},
              paint: { 'fill-outline-color': '#484496', 'fill-color': 'green' }
            });
          } else if (layer.type.toLowerCase() === GEOJSON) {
            const sourceId = `${layer.name}-source`;
            map.addSource(sourceId, {
              type: 'geojson',
              data: layer.metadata.url,
              cluster: true,
              clusterMaxZoom: 14,
              clusterRadius: 50
            });

            // circle and symbol layers for rendering clustered and
            // non-clustered features.
            map.addLayer({
              id: `${layer.name}-circle`,
              type: 'circle',
              source: sourceId,
              paint: {
                'circle-color': 'green',
                'circle-opacity': 0.6,
                'circle-radius': 30
              },
              minzoom: 10,
              maxzoom: 19
            });
          }
        }

        return () => {
          console.log('REMOVE LAYERS: ', selectedLayers);
        };
      });
    },
    [selectedLayers, dataAuthHost]
  );

  useMap(
    mapInstance,
    map => {
      if (selectedScene) {
        console.log('SELECTED SCERNE: ', selectedScene);
        const sourceId = `${selectedScene.id}-source`;
        const layerId = `${selectedScene.id}-layer`;
        map.addSource(sourceId, {
          type: 'raster',
          tiles: [selectedScene.tile_url],
          scheme: 'tms',
          tileSize: 256
        });
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId
        });
      } else {
        if (scenes) {
          scenes.forEach(scene => {
            const sourceId = `${scene.id}-source`;
            const layerId = `${scene.id}-layer`;
            if (map.getSource(sourceId)) {
              map.removeLayer(layerId);
              map.remove(sourceId);
            }
          });
        }
      }
    },
    [selectedScene, scenes, dataAuthHost]
  );

  const heading = useSelector(state => state.sidebar.heading);
  const strapline = useSelector(state => state.sidebar.strapline);
  const visibleMenuItem = useSelector(state => state.sidebar.visibleMenuItem);

  return (
    <>
      <div ref={mapContainer} className={layoutStyles.map} data-testid={`map-${position}`} />

      {isLoading && (
        <div className={layoutStyles.loadMask}>
          <LoadMask />
        </div>
      )}

      {sidebar && (
        <SideMenu>
          <div className={layoutStyles.heading}>
            <div className={layoutStyles.headings}>
              <h3>{heading}</h3>
              <p className={layoutStyles.strapline}>{strapline}</p>
            </div>
            <CloseButton className={layoutStyles.closeButton} onClick={() => dispatch(closeMenu())} />
          </div>

          <div className={layoutStyles.sidebar}>
            {visibleMenuItem === DATA_LAYERS && <DataLayers />}
            {visibleMenuItem === SATELLITE_LAYERS && <SatellitesPanel map={mapInstance} />}
            {visibleMenuItem === ANNOTATIONS && <AnnotationsPanel map={mapInstance} />}
            {visibleMenuItem === BOOKMARKS && <BookmarksPanel map={mapInstance} />}
            {visibleMenuItem === PROFILE && <Profile />}
            {visibleMenuItem === CHANGE_PASSWORD && <PasswordChangeForm />}
          </div>
        </SideMenu>
      )}

      <Button
        theme="secondary"
        onClick={() => setIsMapStyleSwitcherVisible(!isMapStyleSwitcherVisible)}
        classNames={[layoutStyles.mapStyleButton]}
      >
        <DataIcon className={layoutStyles.icon} />
      </Button>
      {isMapStyleSwitcherVisible && (
        <MapStyleSwitcher
          mapStyles={mapStyles || []}
          selectedMapStyle={selectedMapStyle}
          selectMapStyle={selectMapStyle}
        />
      )}
    </>
  );
};

export default React.memo(Map);
