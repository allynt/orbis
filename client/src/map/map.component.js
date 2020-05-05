import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as FileSaver from 'file-saver';
import mapboxgl, { AttributionControl, NavigationControl, ScaleControl } from 'mapbox-gl';
import RotateMode from 'mapbox-gl-draw-rotate-mode';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import CloseButton from '@astrosat/astrosat-ui/dist/buttons/close-button';
import LoadMask from '@astrosat/astrosat-ui/dist/load-mask/load-mask';

import { selectMapStyle, saveMap, setViewport } from './map.slice';
import { selectDataToken, selectFilteredData, selectInactiveLayers } from '../data-layers/data-layers.slice';
import { isLoaded } from '../bookmarks/bookmark.slice';
import { closeMenu } from '../side-menu/side-menu.slice';

import PasswordChangeForm from '../accounts/password-change-form.component';
import Profile from '../accounts/profile.component';
import AnnotationsPanel from '../annotations/annotations-panel.component';
import CircleMode from '../annotations/modes/circle';
import FreehandPolygonMode from '../annotations/modes/freehand-polygon';
import ImageMode from '../annotations/modes/image';
import LabelMode from '../annotations/modes/label';
import LineMode from '../annotations/modes/line';
import PolygonMode from '../annotations/modes/polygon';
import RadiusMode from '../annotations/modes/radius';
import RectangleMode from '../annotations/modes/rectangle';
import drawStyles from '../annotations/styles';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import StoriesPanel from '../stories/stories-panel.component';
import DataLayers from '../data-layers/data-layers.component';
import { ReactComponent as DataIcon } from '../mapstyle/layers.svg';
import MapStyleSwitcher from '../mapstyle/mapstyle-switcher.component';
import SatellitesPanel from '../satellites/satellites-panel.component';
import SideMenu from '../side-menu/side-menu.component';
import {
  ANNOTATIONS,
  BOOKMARKS,
  CHANGE_PASSWORD,
  STORIES,
  DATA_LAYERS,
  PROFILE,
  SATELLITE_LAYERS,
} from '../toolbar/toolbar-constants';
import { GEOJSON, RASTER, VECTOR, personTypes } from './map.constants';
import useMapControl from './use-map-control.hook';
import { useMapEvent, useMapLayerEvent } from './use-map-event.hook';
import useMap from './use-map.hook';
import useMapbox from './use-mapbox.hook';

import InfrastructureDetail from './infrastructure-details.component';
import UserInfoDetail from './user-info-details.component';

import layoutStyles from './map-layout.module.css';

const USER_INFO_TYPE = 'USER_INFO_TYPE';
const INFRASTRUCTURE_INFO_TYPE = 'INFRASTRUCTURE_INFO_TYPE';

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
  setMap,
  compare,
  selectedPinnedScenes,
  comparisonScene,
}) => {
  const accessToken = useSelector(state => (state.app.config ? state.app.config.mapbox_token : null));
  const dataAuthToken = useSelector(selectDataToken);
  const { mapContainer, mapInstance } = useMapbox(style, accessToken, dataAuthToken);

  useEffect(() => {
    if (setMap) setMap(mapInstance);
  }, [setMap, mapInstance]);

  const [isMapStyleSwitcherVisible, setIsMapStyleSwitcherVisible] = useState(false);
  const mapStyles = useSelector(state => state.app.config.mapStyles);
  const selectedMapStyle = useSelector(state => state.map.selectedMapStyle);
  const chooseMapStyle = mapStyle => dispatch(selectMapStyle(mapStyle));

  const isSaveMap = useSelector(state => state.map.saveMap);

  const selectedBookmark = useSelector(state => state.bookmarks.selectedBookmark);

  const selectedStory = useSelector(state => state.stories.selectedStory);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const isLoading = useSelector(state => state.bookmarks.isLoading);

  const [selectedInfoFeatures, setSelectedInfoFeatures] = useState(null);
  const [clickableLayers, setClickableLayers] = useState([]);
  const selectedLayers = useSelector(selectFilteredData);
  const nonSelectedLayers = useSelector(selectInactiveLayers);
  const scenes = useSelector(state => state.satellites.scenes);
  const selectedScene = useSelector(state => state.satellites.selectedScene);
  const visualisationId = useSelector(state => state.satellites.visualisationId);

  const popupRef = useRef(null);

  const dispatch = useDispatch();

  const mapCleanup = map => {
    const suffixes = [
      '-circle',
      '-infrastructure-label',
      '-infrastructure-circle',
      '-population-label',
      '-label-clustered',
      '-cluster',
    ];
    selectedLayers
      .filter(layer => layer.visible === undefined || layer.visible)
      .forEach(layer => {
        suffixes.forEach(suffix => {
          const layerId = `${layer.name}${suffix}`;
          map.getLayer(layerId) && map.removeLayer(layerId);
        });
        map.getSource(`${layer.name}-source`) && map.removeSource(`${layer.name}-source`);
      });
  };

  // let scroller = null;
  // useEffect(() => {
  //   console.log('Setting up scroller');
  //   scroller = scrollama();
  //   scroller
  //     .setup({
  //       step: '.step',
  //       offset: 0.5,
  //       progress: true
  //     })
  //     .onStepEnter(response => {
  //       console.log('onStepEnter: ', response);
  //     })
  //     .onStepExit(response => {
  //       console.log('onStepExit: ', response);
  //     });

  //   window.addEventListener('resize', scroller.resize);
  // }, [mapInstance]);

  useMapControl(mapInstance, attribution, AttributionControl);
  useMapControl(mapInstance, navigation, NavigationControl, 'bottom-right');
  useMapControl(mapInstance, scale, ScaleControl);
  useMapControl(mapInstance, geocoder, MapboxGeocoder, 'top-right', {
    accessToken: accessToken,
    reverseGeocode: true,
    mapboxgl,
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
      RectangleMode,
    },
  });

  useMap(
    mapInstance,
    map => {
      const timer = setTimeout(() => {
        map.resize();
      }, 0);
      return () => clearTimeout(timer);
    },
    [layoutInvalidation],
  );

  useMapEvent(
    mapInstance,
    'move',
    () => {
      const viewport = {
        center: mapInstance.getCenter(),
        zoom: mapInstance.getZoom(),
      };
      dispatch(setViewport(viewport));
    },
    [],
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
    [selectedBookmark],
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
    [isSaveMap, saveMap],
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
    [nonSelectedLayers],
  );

  useMap(
    mapInstance,
    map => {
      mapCleanup(map);
      selectedLayers.forEach(layer => {
        const sourceId = `${layer.name}-source`;
        if (!map.getSource(sourceId)) {
          if (layer.type.toLowerCase() === RASTER) {
            map.addSource(sourceId, {
              type: layer.type,
              tiles: [layer.metadata.url],
              scheme: 'tms',
            });

            map.addLayer({
              id: `${layer.name}-layer`,
              type: layer.type,
              source: sourceId,
              layout: {},
              paint: {},
            });

            return () => {
              map.removeLayer(`${layer.name}-layer`);
              map.removeSource(sourceId);
            };
          } else if (layer.type.toLowerCase() === VECTOR) {
            map.addSource(sourceId, {
              type: layer.type,
              tiles: [layer.metadata.url],
            });

            map.addLayer({
              id: `${layer.name}-layer`,
              type: 'fill',
              source: sourceId,
              'source-layer': layer.name,
              layout: {},
              paint: { 'fill-outline-color': '#484496', 'fill-color': 'green' },
            });
            return () => {
              map.removeLayer(`${layer.name}-layer`);
              map.removeSource(sourceId);
            };
          } else if (layer.type.toLowerCase() === GEOJSON) {
            const sourceId = `${layer.name}-source`;
            let data = null;
            if (layer.data) {
              data = layer.data;
            } else if (layer.metadata.url) {
              data = layer.metadata.url;
            }
            map.addSource(sourceId, {
              type: 'geojson',
              data,
              cluster: true,
              clusterMaxZoom: 14,
              clusterRadius: 50,
            });

            // Calculate the radius for each zoom level between 0-5 as that is
            // where the styling starts to break.
            let radi = [];
            for (let i = 0; i < 20; i++) {
              radi = [...radi, i, ['*', ['sqrt', ['to-number', ['get', 'point_count'], 0]], i]];
            }

            let clusterlayerName = `${layer.name}-cluster`;

            // Clustered features.
            map.addLayer({
              id: clusterlayerName,
              type: 'circle',
              source: sourceId,
              filter: ['any', ['has', 'point_count'], ['!', ['has', 'Type']]],
              paint: {
                'circle-color': '#f6be00',
                'circle-opacity': 1,
                'circle-radius': ['interpolate', ['linear'], ['zoom'], ...radi],
              }, //,
              // minzoom: 10,
              // maxzoom: 19
            });

            // Clustered label
            map.addLayer({
              id: `${layer.name}-label-clustered`,
              source: sourceId,
              type: 'symbol',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': '{point_count}',
              }, //,
              // minzoom: 10,
              // maxzoom: 19
            });

            // Non-Clustered infrastructure background
            const nonClusteredInfrastructureName = `${layer.name}-infrastructure-circle`;
            map.addLayer({
              id: nonClusteredInfrastructureName,
              source: sourceId,
              type: 'circle',
              filter: ['all', ['!', ['has', 'point_count']], ['!', ['has', 'Type']]],
              paint: {
                'circle-color': '#f6be00',
                'circle-opacity': 1,
                'circle-radius': 30,
              }, //,
              // minzoom: 10,
              // maxzoom: 19
            });

            // Non-Clustered infrastructure label
            map.addLayer({
              id: `${layer.name}-infrastructure-label`,
              source: sourceId,
              type: 'symbol',
              filter: ['all', ['!', ['has', 'point_count']], ['!', ['has', 'Type']]],
              layout: {
                'icon-image': '{type}',
                'icon-size': 0.75,
                'icon-allow-overlap': true,
              }, //,
              // minzoom: 10,
              // maxzoom: 19
            });

            const populationLayerName = `${layer.name}-population-label`;
            map.addLayer({
              id: populationLayerName,
              source: sourceId,
              type: 'circle',
              filter: ['all', ['!', ['has', 'point_count']], ['has', 'Type']],
              paint: {
                'circle-color': [
                  'case',
                  ...personTypes.reduce((acc, personType) => {
                    return [...acc, ['==', ['get', 'Type'], personType.name], personType.color];
                  }, []),
                  'black',
                ],
                'circle-opacity': 1,
                'circle-radius': 10,
              }, //,
              // minzoom: 10,
              // maxzoom: 19
            });
            setClickableLayers(currentLayers => [
              ...currentLayers,
              clusterlayerName,
              nonClusteredInfrastructureName,
              populationLayerName,
            ]);
          }
        }

        return () => {
          mapCleanup(map);
        };
      });
    },
    [selectedLayers],
  );

  useMapLayerEvent(
    mapInstance,
    'click',
    clickableLayers,
    event => {
      event.preventDefault();

      const { features, lngLat } = event;

      if (features && features.length > 0) {
        if (features[0].properties.point_count) {
          mapInstance.flyTo({
            center: [lngLat.lng, lngLat.lat],
            zoom: mapInstance.getZoom() + 1,
          });
        } else {
          if (!popupRef.current) {
            const div = document.createElement('div');
            popupRef.current = div;
          }
          // Only take the first feature, which should be the top most
          // feature and the one you meant.
          new mapboxgl.Popup()
            .setLngLat(features[0].geometry.coordinates.slice())
            .setDOMContent(popupRef.current)
            .on('close', () => setSelectedInfoFeatures(null))
            .addTo(mapInstance);

          if (features[0].properties.Type) {
            setSelectedInfoFeatures({ type: USER_INFO_TYPE, data: features });
          } else {
            setSelectedInfoFeatures({ type: INFRASTRUCTURE_INFO_TYPE, data: features });
          }
        }
      }
    },
    [clickableLayers, setSelectedInfoFeatures],
  );

  useMap(
    mapInstance,
    map => {
      if (selectedScene) {
        const sourceId = `${selectedScene.id}-source`;
        const layerId = `${selectedScene.id}-layer`;

        const tileUrl = selectedScene.tile_url.replace(/{VISUALISATION_ID}/, visualisationId);

        map.addSource(sourceId, {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
        });
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
        });
        return () => {
          map.removeLayer(layerId);
          map.removeSource(sourceId);
        };
      } else {
        if (scenes) {
          scenes.forEach(scene => {
            const sourceId = `${scene.id}-source`;
            const layerId = `${scene.id}-layer`;
            if (map.getSource(sourceId)) {
              map.removeLayer(layerId);
              map.removeSource(sourceId);
            }
          });
        }
      }
    },
    [selectedScene, scenes],
  );

  useMap(
    mapInstance,
    map => {
      if (compare && comparisonScene) {
        const sourceId = `${comparisonScene.id}-source`;
        const layerId = `${comparisonScene.id}-layer`;

        const tileUrl = comparisonScene.tile_url.replace(/{VISUALISATION_ID}/, visualisationId);

        map.addSource(sourceId, {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
        });
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
        });
      } else {
        if (selectedPinnedScenes) {
          selectedPinnedScenes.forEach(scene => {
            const sourceId = `${scene.id}-source`;
            const layerId = `${scene.id}-layer`;
            if (map.getSource(sourceId)) {
              map.removeLayer(layerId);
              map.removeSource(sourceId);
            }
          });
        }
      }
    },
    [compare],
  );

  const heading = useSelector(state => state.sidebar.heading);
  const strapline = useSelector(state => state.sidebar.strapline);
  const visibleMenuItem = useSelector(state => state.sidebar.visibleMenuItem);

  useMap(
    mapInstance,
    map => {
      if (selectedStory) {
        console.log('Display Story: ', selectedStory);
        if (!selectedChapter) {
          setSelectedChapter(selectedStory.chapters[0]);
        } else {
          console.log('Display Chapter: ', selectedChapter);
          console.log('MAP STYLE BEFORE: ', map.getStyle());

          map.flyTo(selectedChapter.location);
        }

        if (selectedChapter && selectedChapter.onEnter && selectedChapter.onEnter.length > 0) {
          console.log('DO MAP LAYER STUFF');
          selectedChapter.onEnter.forEach(layer => {
            const sourceId = `${layer.id}-source`;
            if (!map.getSource(sourceId)) {
              if (layer.type.toLowerCase() === VECTOR) {
                console.log('Add VECTOR SOURCE/LAYER: ', layer);
                map.addSource(sourceId, {
                  type: layer.type,
                  tiles: [layer.url],
                });

                map.addLayer({
                  id: `${layer.id}-layer`,
                  type: 'fill',
                  source: sourceId,
                  'source-layer': layer.id,
                  layout: {},
                  paint: { 'fill-outline-color': '#484496', 'fill-color': 'green' },
                });
              } else if (layer.type.toLowerCase() === GEOJSON) {
                console.log('Add GEOJSON SOURCE/LAYER: ', layer);
                map.addSource(sourceId, {
                  type: 'geojson',
                  data: layer.url,
                  cluster: true,
                  clusterMaxZoom: 14,
                  clusterRadius: 50,
                });

                // circle and symbol layers for rendering clustered and
                // non-clustered features.
                map.addLayer({
                  id: `${layer.id}-circle`,
                  type: 'circle',
                  source: sourceId,
                  paint: {
                    'circle-color': 'green',
                    // 'circle-color': ['case', ['has', 'point_count'], 'red', 'green'],
                    'circle-opacity': 0.6,
                    'circle-radius': 30,
                  },
                  minzoom: 10,
                  maxzoom: 19,
                });
              }
            }
          });

          console.log('MAP STYLE AFTER: ', map.getStyle());
        }
      }
    },
    [selectedStory, selectedChapter, setSelectedChapter],
  );

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
            {visibleMenuItem === STORIES && <StoriesPanel map={mapInstance} />}
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
          selectMapStyle={chooseMapStyle}
        />
      )}

      {selectedInfoFeatures &&
        ReactDOM.createPortal(
          <div className={layoutStyles.popup}>
            {selectedInfoFeatures && selectedInfoFeatures.type === USER_INFO_TYPE && (
              <UserInfoDetail features={selectedInfoFeatures.data} />
            )}
            {selectedInfoFeatures && selectedInfoFeatures.type === INFRASTRUCTURE_INFO_TYPE && (
              <InfrastructureDetail features={selectedInfoFeatures.data} />
            )}
          </div>,
          popupRef.current,
        )}

      {selectedStory && (
        <div className={`${layoutStyles.story} step`}>
          {selectedStory && (
            <div>
              <h1>{selectedStory.title}</h1>
              <h3>{selectedStory.subtitle}</h3>

              {selectedChapter && (
                <div className={layoutStyles.chapter}>
                  <picture>
                    <img src={selectedChapter.image} alt={selectedChapter.title} />
                  </picture>

                  <section>{selectedChapter.description}</section>
                </div>
              )}

              <div className={layoutStyles.buttons}>
                <Button
                  theme="tertiary"
                  onClick={() => {
                    if (selectedChapter) {
                      let index = selectedStory.chapters.indexOf(selectedChapter);
                      const previousChapter = selectedStory.chapters[--index];
                      if (previousChapter) {
                        setSelectedChapter(previousChapter);
                      }
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  theme="Primary"
                  onClick={() => {
                    if (selectedChapter) {
                      let index = selectedStory.chapters.indexOf(selectedChapter);
                      const nextChapter = selectedStory.chapters[++index];
                      if (nextChapter) {
                        setSelectedChapter(nextChapter);
                      }
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(Map);
