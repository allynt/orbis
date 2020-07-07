import { CompositeLayer, IconLayer, TextLayer } from 'deck.gl';

const DEFAULT_FONT_FAMILY = 'Open Sans';
const DEFAULT_FONT_WEIGHT = 600;

export class ClusteredIconLayer extends CompositeLayer {
  renderLayers() {
    return [
      new IconLayer(
        this.getSubLayerProps({
          id: 'icon',
          data: this.props.data,
          iconAtlas: this.props.iconAtlas,
          iconMapping: this.props.iconMapping,
          getPosition: this.props.getPosition,
          getIcon: this.props.getIcon,
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
          data: this.props.data,
          fontFamily: this.props.fontFamily,
          fontWeight: this.props.fontWeight,
          getPosition: this.props.getPosition,
          getText: this.props.getText,
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
