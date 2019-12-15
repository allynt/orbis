import React, { useImperativeHandle } from 'react';
// import ReactDOM from 'react-dom';

import mapboxgl, { AttributionControl, NavigationControl, ScaleControl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Compare from 'mapbox-gl-compare';
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
// import LayerTreeControl from '../layer-tree/layer-tree.control';
// import AccountMenuButton from '../accounts/account-menu-button.component';
// import { logout } from '../accounts/accounts.actions';

import SideMenuContainer from '../side-menu/side-menu.container';
import AnnotationsPanel from '../annotations/annotations-panel.component';
import BookmarksPanel from '../bookmarks/bookmarks-panel.component';
import { setViewport } from './map.actions';
// import Annotations from '../annotations/annotations.component';
// import Bookmarks from '../bookmarks/bookmarks.component';

// import { history } from '../store';

// import LabelForm from '../annotations/label-form.component';
// import { formatKey } from '../utils/utils';
// import InfrastructureDetail from './infrastructure-details.component';
// import { selectedFeatureIds } from '../factsheet/factsheet.selector';
// import { CUSTOM_DATA_THRESHOLD } from '../constants';

import { Detail } from '@astrosat/astrosat-ui';

import RotateMode from 'mapbox-gl-draw-rotate-mode';
import RadiusMode from '../annotations/modes/radius';
import LineMode from '../annotations/modes/line';
import PolygonMode from '../annotations/modes/polygon';
import FreehandPolygonMode from '../annotations/modes/freehand-polygon';
import CircleMode from '../annotations/modes/circle';
import LabelMode from '../annotations/modes/label';
import ImageMode from '../annotations/modes/image';

import LayerTree from '../layer-tree/layer-tree.component';
import UpdateUserFormContainer from '../accounts/update-user-form.container';
import PasswordChangeContainer from '../accounts/password-change-form.container';

import { ANNOTATIONS, BOOKMARKS, DATA_LAYERS, PROFILE, CHANGE_PASSWORD } from '../toolbar/constants';

// import SpyglassControl from '../spyglass/spyglass.control';

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

const ComparisonMap = (
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
    sidebar = false
  },
  ref
) => {
  const accessToken = useSelector(state => (state.app.config ? state.app.config.mapbox_token : null));

  const [ mapContainerBefore, mapInstanceBefore, mapPromiseBefore ] = useMapbox(style, accessToken);
  const [ mapContainerAfter, mapInstanceAfter, mapPromiseAfter ] = useMapbox(style, accessToken);
  const comparisonMap = new Compare(mapInstanceBefore, mapInstanceAfter, { })

  const dispatch = useDispatch();

  // useMapControl(mapInstance, attribution, AttributionControl);
  // useMapControl(mapInstance, navigation, NavigationControl, 'bottom-right');
  // useMapControl(mapInstance, scale, ScaleControl);
  // useMapControl(mapInstance, geocoder, MapboxGeocoder, 'top-left', {
  //   accessToken: accessToken,
  //   reverseGeocode: true,
  //   mapboxgl
  // });
  // useMapControl(mapInstance, save, SaveMapControl, 'top-right');
  // useMapControl(mapInstance, draw, MapboxDraw, 'top-left', {
  //   displayControlsDefault: false,
  //   userProperties: true,
  //   styles: drawStyles,
  //   modes: {
  //     ...MapboxDraw.modes,
  //     RotateMode,
  //     RadiusMode,
  //     LineMode,
  //     PolygonMode,
  //     FreehandPolygonMode,
  //     CircleMode,
  //     LabelMode,
  //     ImageMode
  //   }
  // });
  // useMapControl(mapInstance, layerTree, LayerTreeControl, 'top-right');

  useMap(
    mapInstanceBefore,
    map => {
      const timer = setTimeout(() => {
        map.resize();
      }, 0);
      return () => clearTimeout(timer);
    },
    [layoutInvalidation]
  );

  useMapEvent(
    mapInstanceBefore,
    'move',
    () => {
      const viewport = {
        center: mapInstanceBefore.getCenter(),
        zoom: mapInstanceBefore.getZoom()
      };
      dispatch(setViewport(viewport));
    },
    []
  );

  useImperativeHandle(ref, () => comparisonMap);

  return (
    <div ref={mapContainerBefore} className={layoutStyles.map} data-testid={`map-${position}`}>
    </div>
  );
};

export default React.memo(React.forwardRef(ComparisonMap));
