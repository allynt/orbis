import mapboxgl from 'mapbox-gl';

import syncMove from '../map/mapbox-gl-sync-move';

import './mini-map.control.css';

class MiniMapControl {
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

    this.container = document.createElement('div');
    const handle = document.createElement('div');
    handle.className = 'mapboxgl-ctrl mini-map-handle';
    handle.innerHTML = '<strong>Drag Me</strong>';
    this.container.className = 'mapboxgl-ctrl mini-map-control';

    const miniMap = new mapboxgl.Map({
      container: this.container,
      style: this.mainMap.getStyle(),
      center: this.mainMap.getCenter(),
      zoom: this.mainMap.getZoom() - 5
    });

    syncMove(this.mainMap, miniMap);

    this.container.appendChild(handle);

    return this.container;
  }

  /**
   *
   *
   * @memberof MiniMapControl
   */
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.mainMap = undefined;
  }
}

export default MiniMapControl;
