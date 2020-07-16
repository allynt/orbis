import { CompositeLayer, IconLayer, TextLayer } from 'deck.gl';
import Supercluster from 'supercluster';

const DEFAULT_FONT_FAMILY = 'Open Sans';
const DEFAULT_FONT_WEIGHT = 600;

export class ClusteredIconLayer extends CompositeLayer {
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

    const zoom = Math.floor(this.context.viewport.zoom);
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
        info.object.properties.expansion_zoom = this.state.index.getClusterExpansionZoom(
          info.object.properties.cluster_id,
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

  renderLayers() {
    const { data } = this.state;
    return [
      new IconLayer(
        this.getSubLayerProps({
          id: 'icon',
          data,
          iconAtlas: this.props.iconAtlas,
          iconMapping: this.props.iconMapping,
          getPosition: this.props.getPosition,
          getIcon: d =>
            d.properties.cluster
              ? this.props.getIcon({
                  ...d,
                  properties: {
                    ...d.properties,
                    expansion_zoom: this.state.index.getClusterExpansionZoom(
                      d.properties.cluster_id,
                    ),
                  },
                })
              : this.props.getIcon(d),
          getSize: this.props.getIconSize,
          getColor: this.props.getIconColor,
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
          id: 'text',
          data,
          fontFamily: this.props.fontFamily,
          fontWeight: this.props.fontWeight,
          getPosition: this.props.getPosition,
          getText: d =>
            d.properties.cluster ? `${d.properties.point_count}` : ` `,
          getSize: this.props.getTextSize,
          getColor: this.props.getTextColor,
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

ClusteredIconLayer.layerName = 'ClusteredIconLayer';

ClusteredIconLayer.defaultProps = {
  // Shared accessors
  getPosition: { type: 'accessor', value: x => x.position },
  // Icon properties
  iconAtlas: null,
  iconMapping: { type: 'object', value: {}, async: true },
  // Icon accessors
  getIcon: { type: 'accessor', value: x => x.icon },
  getIconSize: { type: 'accessor', value: 20 },
  getIconColor: { type: 'accessor', value: [0, 0, 0, 255] },
  // Text properties
  fontFamily: DEFAULT_FONT_FAMILY,
  fontWeight: DEFAULT_FONT_WEIGHT,
  // Text accessors
  getText: { type: 'accessor', value: x => x.text },
  getTextSize: { type: 'accessor', value: 12 },
  getTextColor: { type: 'accessor', value: [0, 0, 0, 255] },
};
