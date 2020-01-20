import React, { useImperativeHandle, useState } from 'react';
// import ReactDOM from 'react-dom';

// import Measure from 'react-measure';

import mapboxgl, { AttributionControl, NavigationControl, ScaleControl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

import { useDispatch, useSelector } from 'react-redux';
// import { useMapCrossFilter } from '../crossfilter';
import useMapbox from './use-mapbox.hook';
import useMap from './use-map.hook';
import useMapControl from './use-map-control.hook';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
// import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
// import { setClickedFeature, MULTI_SELECT } from '../factsheet/factsheet.action';
import { useMapEvent } from './use-map-event.hook';
import SaveMapControl from '../save-map/save-map-control';
import MapStyleSwitcher from '../mapstyle/mapstyle-switcher.component';
import { MAP_STYLE_SELECTED, setViewport } from './map.actions';
import { closeMenu } from '../side-menu/side-menu.actions';
// import LayerTreeControl from '../layer-tree/layer-tree.control';
// import AccountMenuButton from '../accounts/account-menu-button.component';
// import { logout } from '../accounts/accounts.actions';

import SideMenuContainer from '../side-menu/side-menu.container';
import AnnotationsPanel from '../annotations/annotations-panel.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import DataLayers from '../data-layers/data-layers.component';
import Profile from '../accounts/profile.component';
import UpdateUserFormContainer from '../accounts/update-user-form.container';
import PasswordChangeForm from '../accounts/password-change-form.component';
// import { setViewport } from './map.actions';
// import Annotations from '../annotations/annotations.component';
// import Bookmarks from '../bookmarks/bookmarks.component';

// import { history } from '../store';

// import LabelForm from '../annotations/label-form.component';
// import { formatKey } from '../utils/utils';
// import InfrastructureDetail from './infrastructure-details.component';
// import { selectedFeatureIds } from '../factsheet/factsheet.selector';
// import { CUSTOM_DATA_THRESHOLD } from '../constants';

// import Detail from '@astrosat/astrosat-ui/dist/containers/detail';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import CloseButton from '@astrosat/astrosat-ui/dist/buttons/close-button';
// import { Detail } from '@astrosat/astrosat-ui';
import { ReactComponent as DataIcon } from '../toolbar/data.svg';

import RotateMode from 'mapbox-gl-draw-rotate-mode';
import RadiusMode from '../annotations/modes/radius';
import LineMode from '../annotations/modes/line';
import PolygonMode from '../annotations/modes/polygon';
import FreehandPolygonMode from '../annotations/modes/freehand-polygon';
import CircleMode from '../annotations/modes/circle';
import LabelMode from '../annotations/modes/label';
import ImageMode from '../annotations/modes/image';

import LayerTree from '../layer-tree/layer-tree.component';

import { ANNOTATIONS, BOOKMARKS, DATA_LAYERS, PROFILE, CHANGE_PASSWORD } from '../toolbar/constants';

import { GEOJSON, RASTER, VECTOR } from './map.constants';

// import SpyglassControl from '../spyglass/spyglass.control';

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

// const interpolate = interpolation => (property, filter, values) => [
//   interpolation,
//   ['linear'],
//   ['get', property],
//   filter[0],
//   values[0],
//   filter[1],
//   values[1]
// ];

// const interpolateLinear = interpolate('interpolate');
// const interpolateHcl = interpolate('interpolate-hcl');
// const interpolateZoom = (min, max) => ['interpolate', ['linear'], ['zoom'], 6, min, 22, max];

const Map = (
  {
    selectedProperty,
    style = 'mapbox://styles/thermcert/cjxzywxui08131cry0du0zn4v',
    colorScheme,
    attribution = true,
    geocoder = true,
    navigation = true,
    spyglass = false,
    scale = true,
    draw = true,
    save = true,
    layerTree = true,
    layoutInvalidation,
    position,
    sidebar = false,
    compare = false,
    compareRatio,
    dimensions
  },
  ref
) => {
  const accessToken = useSelector(state => (state.app.config ? state.app.config.mapbox_token : null));

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

  // const labelButtonSelected = useSelector(state => state.annotations.textLabelSelected);

  const openFeature = useSelector(state => state.sidebar.visibleMenuItem);

  const selectedBookmark = useSelector(state => state.bookmarks.selectedBookmark);

  // const { properties, filters, currentFilters, visible, setBounds } = useMapCrossFilter(selectedProperty);
  // const selectedPropertyMetadata = properties.find(property => property.field === selectedProperty);
  const dataAuthToken = useSelector(state => state.map.dataToken);
  const dataAuthHost = useSelector(state => state.map.dataUrl);
  const dataSources = useSelector(state => state.map.dataSources);

  const allLayers = dataSources.reduce((acc, value) => {
    acc = Array.from(new Set([...acc, ...value.layers]));
    return acc;
  }, []);
  const selectedLayers = useSelector(state => state.dataLayers.layers);
  const nonSelectedLayers = allLayers.filter(layer => !selectedLayers.includes(layer));
  const { mapContainer, mapInstance, mapPromise } = useMapbox(style, accessToken, dataAuthToken, dataAuthHost);

  // const user = useSelector(state => state.accounts.user);

  // const [hoveredFeature, setHoveredFeature] = useState(null);

  // const selectedLsoaFeatureIds = useSelector(selectedFeatureIds);
  // const infrastructureLayers = useSelector(state => state.map.infrastructureLayers);

  // const customLayers = useSelector(state => state.map.customLayers);

  // const [selectedInfrastructureFeature, setSelectedInfrastructureFeature] = useState(null);
  // const [selectedCustomFeature, setSelectedCustomFeature] = useState(null);

  // const is3DMode = useSelector(state => state.map.is3DMode);

  // const popupRef = useRef(null);

  const dispatch = useDispatch();

  // const isSpyglassVisible = useSelector(state => state.map.isSpyglassVisible);
  // console.log('IS MINI MAP VISIBLE: ', isMiniMapVisible);

  useMapControl(mapInstance, attribution, AttributionControl);
  useMapControl(mapInstance, navigation, NavigationControl, 'bottom-right');
  // useMapControl(mapInstance, spyglass, SpyglassControl, 'bottom-right', {
  //   visibility: isSpyglassVisible ? 'visible' : 'hidden'
  // });
  useMapControl(mapInstance, scale, ScaleControl);
  useMapControl(mapInstance, geocoder, MapboxGeocoder, 'top-right', {
    accessToken: accessToken,
    reverseGeocode: true,
    mapboxgl
  });
  useMapControl(mapInstance, save, SaveMapControl, 'top-right');
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
      ImageMode
    }
  });
  // useMapControl(mapInstance, layerTree, LayerTreeControl, 'top-right');

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
      }
    },
    [selectedBookmark]
  );

  // const [bounds, setBounds] = useState(null);

  // const compareMove = event => {
  //   event = event.touches ? event.touches[0] : event;
  //   let x = event.clientX - bounds.left;
  //   if (x < 0) x = 0;
  //   if (x > bounds.width) x = bounds.width;
  //   const ratio = x / bounds.width;
  //   // props.layerActions.moveCompare(ratio);
  // };
  // const compareTouchEnd = () => {
  //   document.removeEventListener('touchmove', compareMove);
  //   document.removeEventListener('touchend', compareTouchEnd);
  // };
  // const compareMouseEnd = () => {
  //   document.removeEventListener('mousemove', compareMove);
  //   document.removeEventListener('mouseup', compareMouseEnd);
  // };
  // const compareDown = event => {
  //   if (event.touches) {
  //     document.addEventListener('touchmove', compareMove);
  //     document.addEventListener('touchend', compareTouchEnd);
  //   } else {
  //     document.addEventListener('mousemove', compareMove);
  //     document.addEventListener('mouseup', compareMouseEnd);
  //   }
  // };

  // const compareMove = e => {
  //   e = e.touches ? e.touches[0] : e;
  //   let x = e.clientX - this.bounds.left;
  //   if (x < 0) x = 0;
  //   if (x > this.bounds.width) x = this.bounds.width;
  //   const ratio = x / this.bounds.width;
  //   this.props.layerActions.moveCompare(ratio);
  // };
  // const compareTouchEnd = () => {
  //   document.removeEventListener("touchmove", compareMove);
  //   document.removeEventListener("touchend", compareTouchEnd);
  // };
  // const compareMouseEnd = () => {
  //   document.removeEventListener("mousemove", compareMove);
  //   document.removeEventListener("mouseup", compareMouseEnd);
  // };
  // const compareDown = e => {
  //   if (e.touches) {
  //     document.addEventListener("touchmove", compareMove);
  //     document.addEventListener("touchend", compareTouchEnd);
  //   } else {
  //     document.addEventListener("mousemove", compareMove);
  //     document.addEventListener("mouseup", compareMouseEnd);
  //   }
  // };

  // useMap(
  //   mapInstance,
  //   map => {
  //     const spyglassMap = mapInstance._controls.find(ctrl => ctrl instanceof SpyglassControl);
  //     console.log('TOGGLE SPYGLASS: ', isSpyglassVisible);
  //     spyglassMap.toggleSpyglass();
  //   },
  //   [isSpyglassVisible]
  // );

  // useMapEvent(
  //   mapInstance,
  //   'click',
  //   event => {
  //     event.preventDefault();
  //     const { features, lngLat } = event;
  //     // console.log('FEATURES');

  //     // When user clicks map open Label Editor.
  //     if (!popupRef.current) {
  //       popupRef.current = document.createElement('div');
  //     }

  //     // Only take the first feature, which should be the top most
  //     // feature and the one you meant.
  //     if (labelButtonSelected) {
  //       console.log('POPUP CONTENT: ', popupRef);
  //       new mapboxgl.Popup()
  //         // .setLngLat(features[0].geometry.coordinates.slice())
  //         .setLngLat(lngLat)
  //         .setDOMContent(popupRef.current)
  //         .on('close', () => console.log('Closing Popup'))
  //         .addTo(mapInstance);
  //     }
  //   },
  //   [popupRef, labelButtonSelected]
  // );

  useMap(
    mapInstance,
    map => {
      nonSelectedLayers.forEach(layer => {
        const sourceId = `${layer.name}-source`;
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
      });
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
              tiles: [layer.metadata.url]
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
                // 'circle-color': ['case', ['has', 'point_count'], 'red', 'green'],
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
          // const property = properties
          //   .filter(property => property.type === 'raster')
          //   .find(property => property.field === selectedProperty);
          // if (property) {
          //   map.removeLayer(property.field);
          //   map.removeSource(`${property.field}-source`);
          // }
        };
      });
    },
    [selectedLayers, dataAuthHost]
  );

  useImperativeHandle(ref, () => mapPromise);

  const heading = useSelector(state => state.sidebar.heading);
  const strapline = useSelector(state => state.sidebar.strapline);
  const visibleMenuItem = useSelector(state => state.sidebar.visibleMenuItem);

  return (
    // <Measure
    //   bounds
    //   onResize={contentRect => {
    //     const { width, height } = contentRect.bounds;
    //     console.log('UPDATE DIMENSIONS: ', width, height);
    //     // layerActions.updateDimensions(width, height);
    //   }}
    // >
    <div ref={mapContainer} className={layoutStyles.map} data-testid={`map-${position}`}>
      {/* <AccountMenuButton user={user} logout={() => dispatch(logout(history))} /> */}
      {sidebar && (
        <SideMenuContainer>
          <div className={layoutStyles.heading}>
            <div className={layoutStyles.headings}>
              <h3>{heading}</h3>
              <p className={layoutStyles.strapline}>{strapline}</p>
            </div>
            <CloseButton onClick={() => dispatch(closeMenu())} />
          </div>

          <div className={layoutStyles.sidebar}>
            {visibleMenuItem === DATA_LAYERS && <DataLayers />}
            {/* {visibleMenuItem === DATA_LAYERS && <LayerTree map={mapInstance} />} */}
            {visibleMenuItem === ANNOTATIONS && <AnnotationsPanel map={mapInstance} />}
            {visibleMenuItem === BOOKMARKS && <BookmarksPanel map={mapInstance} />}
            {visibleMenuItem === PROFILE && <Profile />}
            {visibleMenuItem === CHANGE_PASSWORD && <PasswordChangeForm />}

            {/* <Detail title={ANNOTATIONS} isOpen={openFeature === ANNOTATIONS}>
              <AnnotationsPanel map={mapInstance} />
            </Detail>
            <Detail title={BOOKMARKS} isOpen={openFeature === BOOKMARKS}>
              <BookmarksPanel map={mapInstance} />
            </Detail>
            <Detail title={DATA_LAYERS} isOpen={openFeature === DATA_LAYERS}>
              <LayerTree map={mapInstance} />
            </Detail>
            <Detail title={PROFILE} isOpen={openFeature === PROFILE}>
              <UpdateUserFormContainer />
            </Detail>
            <Detail title={CHANGE_PASSWORD} isOpen={openFeature === CHANGE_PASSWORD}>
              <PasswordChangeForm />
            </Detail> */}
          </div>
        </SideMenuContainer>
      )}

      <Button
        theme="secondary"
        onClick={() => setIsMapStyleSwitcherVisible(!isMapStyleSwitcherVisible)}
        classNames={[layoutStyles.mapStyleButton]}
      >
        <DataIcon className={layoutStyles.icon} />
        {/* <picture>
          <source srcSet={selectedMapStyleIconWebP} type="image/webp" />
          <img src={selectedMapStyleIcon} alt="Preview" />
          <div>{selectedMapStyle.title}</div>
        </picture> */}
      </Button>
      {isMapStyleSwitcherVisible && (
        <MapStyleSwitcher
          mapStyles={mapStyles || []}
          selectedMapStyle={selectedMapStyle}
          selectMapStyle={selectMapStyle}
        />
      )}

      {/* {position === 1 && compare && (
        <div
          className={layoutStyles.compare}
          // style={{ transform: `translate(${compareRatio * dimensions.get('width')}px, 0px` }}
          onMouseDown={compareDown}
          onTouchStart={compareDown}
        >
          <div className={layoutStyles.swiper} />
        </div>
      )}
 */}
      {/* <Annotations map={mapInstance} />
      <Bookmarks map={mapInstance} />
      <LayerTree map={mapInstance} /> */}

      {/* {popupRef.current &&
        ReactDOM.createPortal(
          <div className={layoutStyles.popup}>
            <p>I just want some text</p>
            <LabelForm />
          </div>,
          popupRef.current
        )} */}
      {/* {selectedCustomFeature &&
        ReactDOM.createPortal(
          <div className={layoutStyles.popup}>
            <ul className={layoutStyles.list}>
              {Object.keys(selectedCustomFeature.properties).map(key => (
                <li key={key}>
                  <span className={layoutStyles.label}>{formatKey(key)}:</span>
                  {selectedCustomFeature.properties[key]}
                </li>
              ))}
            </ul>
          </div>,
          popupRef.current
        )} */}
    </div>
    // </Measure>
  );
};

export default React.memo(React.forwardRef(Map));
