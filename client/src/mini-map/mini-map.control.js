import mapboxgl from 'mapbox-gl';

import syncMaps from '../map/mapbox-gl-sync-move';
import draggable from './draggable';

import './mini-map.control.css';

class MiniMapControl {
  constructor(options = { isVisible: 'visible' }) {
    this.options = options;
    this.toggleMiniMap = this.toggleMiniMap.bind(this);
  }

  /**
   * When adding control to a map, set the default value and set
   * the content to update when the mouse moves.
   *
   * @param {*} map
   *
   * @returns
   *
   * @memberof MiniMapControl
   */
  onAdd(map) {
    this.mainMap = map;

    console.log('OPTIONS: ', this.options);
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mini-map-control';

    this.mapContainer = document.createElement('div');
    this.mapContainer.id = 'miniMapContainer';
    this.mapContainer.className = 'mapboxgl-ctrl mini-map-container';
    this.mapContainer.style.visibility = this.options.visibility;

    // const toggleButton = document.createElement('div');
    // toggleButton.className = 'mapboxgl-ctrl toggle-mini-map';
    // toggleButton.innerText = 'X';
    // toggleButton.onclick = this.toggleMiniMap;

    const handle = document.createElement('div');
    handle.className = 'mapboxgl-ctrl mini-map-handle';
    handle.innerHTML = '<strong>Drag Me</strong>';

    this.miniMap = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.mainMap.getStyle(),
      center: this.mainMap.getCenter(),
      zoom: this.mainMap.getZoom()
    });

    // Resize the map canvas, before this it was larger, but
    // most of it was hidden, making it look like the map was
    // off-center.
    this.miniMap.on('load', event => {
      event.target.resize();
    });

    draggable(this.mapContainer, handle);

    syncMaps(this.mainMap, this.miniMap);

    this.mapContainer.appendChild(handle);

    // this.container.appendChild(toggleButton);

    this.container.appendChild(this.mapContainer);

    return this.container;
  }

  toggleMiniMap(event) {
    this.mapContainer.style.visibility === 'visible'
      ? (this.mapContainer.style.visibility = 'hidden')
      : (this.mapContainer.style.visibility = 'visible');
  }

  /**
   *
   *
   * @memberof MiniMapControl
   */
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.miniMap = undefined;
    this.mainMap = undefined;
  }
}

export default MiniMapControl;
