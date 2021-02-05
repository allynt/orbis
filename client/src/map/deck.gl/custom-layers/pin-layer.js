import { CompositeLayer } from '@deck.gl/core';
import { IconLayer, TextLayer } from '@deck.gl/layers';
import Supercluster from 'supercluster';
import iconMapping from './pin-layer.iconMapping.json';
import iconAtlas from './pin-layer.iconAtlas.svg';

const TEXT_COLOR_TRANSPARENT = [0, 0, 0, 0];

export class PinLayer extends CompositeLayer {
  _getExpansionZoom(feature) {
    return this.state.index.getClusterExpansionZoom(
      feature.properties.cluster_id,
    );
  }

  _injectExpansionZoom(feature) {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        expansion_zoom: this._getExpansionZoom(feature),
      },
    };
  }

  shouldUpdateState({ changeFlags }) {
    return changeFlags.somethingChanged;
  }

  updateState({ props, oldProps, changeFlags }) {
    const rebuildIndex =
      changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;
    if (rebuildIndex) {
      const index = new Supercluster({
        maxZoom: this.props.maxZoom || 16,
        radius: this.props.clusterRadius,
      });
      index.load(
        props.data.map(d => ({
          geometry: { coordinates: this.props.getPosition(d) },
          properties: d.properties,
        })),
      );
      this.setState({ index });
    }

    const zoom = Math.ceil(this.context.viewport.zoom);
    if (rebuildIndex || zoom !== this.state.zoom) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], zoom),
        zoom,
      });
    }
  }

  getPickingInfo({ info, mode }) {
    if (info.picked) {
      if (info.object.properties.cluster) {
        info.object.properties.expansion_zoom = this._getExpansionZoom(
          info.object,
        );
        if (mode !== 'hover') {
          info.objects = this.state.index.getLeaves(
            info.object.properties.cluster_id,
            Infinity,
          );
        }
      }
    }
    return info;
  }

  // ===== Pin/Cluster Layer Functions =====
  _getPinIcon(feature) {
    if (
      feature.properties.cluster &&
      this._getExpansionZoom(feature) <= this.props.maxZoom
    ) {
      return 'cluster';
    }
    return 'pin';
  }

  _getPinLayerIconSize(feature) {
    if (
      feature.properties.cluster &&
      this._getExpansionZoom(feature) <= this.props.maxZoom
    ) {
      return this.props.clusterIconSize;
    }
    return typeof this.props.getPinSize === 'function'
      ? this.props.getPinSize(feature)
      : this.props.getPinSize;
  }

  // ===== Text Layer Functions =====

  _getTextColor(feature) {
    if (feature.properties.cluster && this.props.hideTextOnGroup) {
      if (this._getExpansionZoom(feature) > this.props.maxZoom)
        return TEXT_COLOR_TRANSPARENT;
    }
    if (typeof this.props.getTextColor === 'function')
      return feature.properties.cluster
        ? this.props.getTextColor(this._injectExpansionZoom(feature))
        : this.props.getTextColor(feature);
    return this.props.getTextColor;
  }

  renderLayers() {
    const { data } = this.state;
    return [
      new IconLayer(
        this.getSubLayerProps({
          id: `${this.props.id}-pin`,
          data,
          iconAtlas,
          iconMapping,
          getPosition: this.props.getPosition,
          getIcon: d => this._getPinIcon(d),
          getSize: d => this._getPinLayerIconSize(d),
          getColor: [246, 190, 0, 255],
          updateTriggers: {
            getPosition: this.props.updateTriggers.getPosition,
            getIcon: this.props.updateTriggers.getIcon,
            getSize: this.props.updateTriggers.getIconSize,
            getColor: this.props.updateTriggers.getIconColor,
          },
        }),
      ),
      new TextLayer(
        this.getSubLayerProps({
          id: `${this.props.id}-text`,
          data,
          fontFamily: this.props.fontFamily,
          fontWeight: this.props.fontWeight,
          getPosition: this.props.getPosition,
          getText: feature =>
            feature.properties.cluster
              ? `${feature.properties.point_count}`
              : ` `,
          getSize: this.props.getTextSize,
          getColor: feature => this._getTextColor(feature),
          updateTriggers: {
            getPosition: this.props.updateTriggers.getPosition,
            getText: this.props.updateTriggers.getText,
            getSize: this.props.updateTriggers.getTextSize,
            getColor: this.props.updateTriggers.getTextColor,
          },
        }),
      ),
    ];
  }
}

PinLayer.layerName = 'PinLayer';
PinLayer.defaultProps = {
  // Shared accessors
  pickable: true,
  getPosition: { type: 'accessor', value: x => x.position },
  // ===== Pin/Cluster Layer Props =====
  // accessors
  getPinSize: { type: 'accessor', value: 70 },
  getIconColor: { type: 'accessor', value: [0, 0, 0, 255] },
  // ===== Icon Layer Props =====
  getIcon: { type: 'accessor', value: x => x.icon },
  getIconSize: { type: 'accessor', value: 70 },
  // ===== Text Layer Props =====
  // properties
  fontFamily: 'Open Sans',
  fontWeight: 600,
  // accessors
  getTextSize: { type: 'accessor', value: 32 },
  getTextColor: { type: 'accessor', value: [51, 63, 72] },
  // ===== Clustering properties =====
  maxZoom: 20,
  clusterRadius: 40,
  hideTextOnGroup: true,
  clusterIconName: 'cluster',
  clusterIconSize: 80,
  groupIconName: 'group',
  groupIconSize: 70,
};
