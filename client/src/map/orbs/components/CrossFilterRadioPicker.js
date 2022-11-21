import React, { useState } from 'react';

import {
  makeStyles,
  Grid,
  FormControlLabel,
  Radio,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import {
  ColormapRangeSlider,
  ColorAdjustSlider,
  InfoButtonTooltip,
  TooltipContent,
} from 'components';
import { createCategorisationPath } from 'data-layers/categorisation.utils';
import { crossFilteringCommonGeometrySelector } from 'data-layers/data-layers.slice';
import { isRealValue } from 'utils/isRealValue';

import {
  selectedPropertySelector,
  crossFilterRangesSelector,
  setFilterRange,
  setClipRange,
  setSelectedProperty,
} from '../crossfilter-layers.slice';

const SCALE_VALUES = {
  filter: 'Adjust Filter',
  colour: 'Adjust Colour',
};

const useStyles = makeStyles(({ spacing, typography: { pxToRem } }) => ({
  radioIconContainer: {
    marginBottom: spacing(2),
  },
  slidersGridItem: {
    padding: spacing(2),
  },
  slider: {
    width: `calc(310px - ${spacing(6)})`,
    margin: spacing(1, 'auto', 2),
  },
  isActive: {
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
    borderRadius: '0.3rem',
    padding: '0 0.3rem 0 1rem',
    color: 'black',
  },
}));

/**
 * @param {{
 *   selectedLayer: object
 *   dispatch: import('redux').Dispatch
 * }} props
 */
const CrossFilterRadioPicker = ({ selectedLayer, dispatch }) => {
  const styles = useStyles();
  const selectedProperty = useSelector(state =>
    selectedPropertySelector(state?.orbs),
  );

  const filterRanges = useSelector(state =>
    crossFilterRangesSelector(state?.orbs),
  );

  const commonGeometry = useSelector(crossFilteringCommonGeometrySelector);

  /**
   * @param {string} propertyName
   * @param {[number, number]} filterRange
   */
  const handleSliderChange = (propertyName, filterRange) =>
    dispatch(
      setFilterRange({
        key: 'crossFilterRanges',
        propertyName,
        filterRange,
      }),
    );

  /**
   * @param {string} propertyName
   * @param {[number, number]} clipRange
   */
  const handleClipChange = (propertyName, clipRange) => {
    dispatch(
      setClipRange({
        key: 'crossFilterRanges',
        propertyName,
        clipRange,
      }),
    );
  };

  /** @param {object} selectedProperty */
  const handleRadioClick = selectedProperty =>
    dispatch(
      setSelectedProperty({
        key: 'selectedProperty',
        selectedProperty,
      }),
    );

  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  return (
    <Grid container direction="column">
      {selectedLayer?.properties.map(property => (
        <Grid
          key={property.name}
          item
          container
          className={`${styles.slidersGridItem} ${
            selectedProperty?.name === property.name ? styles.isActive : ''
          }`}
        >
          <Grid item container className={styles.radioIconContainer}>
            <Grid item xs={11}>
              <FormControlLabel
                checked={selectedProperty?.name === property.name}
                label={
                  property?.application?.orbis?.crossfiltering?.label ??
                  property?.label
                }
                control={
                  <Radio
                    onClick={() => handleRadioClick(property)}
                    name="isolationPlus"
                  />
                }
              />
            </Grid>
            <Grid item xs={1}>
              <InfoButtonTooltip
                tooltipContent={
                  <TooltipContent
                    categoryPath={categoryPath}
                    description={
                      <>
                        <h4>Property Description:</h4>
                        <p>
                          {property?.application?.orbis?.description ??
                            property.description}
                        </p>

                        <h4>Source Description:</h4>
                        <p>{selectedLayer?.metadata?.description}</p>
                      </>
                    }
                  />
                }
              />
            </Grid>
          </Grid>
          <Grid item>
            <Slider
              property={property}
              selectedProperty={selectedProperty}
              filterRanges={filterRanges[property.name]}
              onRangeFilterChange={filterValue =>
                handleSliderChange(property.name, filterValue)
              }
              onClipRangeChange={clipValue =>
                handleClipChange(property.name, clipValue)
              }
              commonGeometry={commonGeometry}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * @param {{
 *  property: object
 *  filterRanges: { filterRange: [number, number], clipRange: [number, number] }
 *  onRangeFilterChange: (filterValue: [number, number]) => void
 *  onClipRangeChange: (clipValue: [number, number]) => void
 *  commonGeometry: string
 * }} props
 */
const Slider = ({
  property,
  selectedProperty,
  filterRanges,
  onRangeFilterChange,
  onClipRangeChange,
  commonGeometry,
}) => {
  const styles = useStyles();
  const [scale, setScale] = useState(SCALE_VALUES.filter);

  const handleToggleChange = (_, newValue) => {
    if (!newValue || scale === newValue) return;
    return setScale(newValue);
  };

  const { min, max } =
    property?.application?.orbis?.crossfiltering[commonGeometry] ?? {};

  const { color, colormap_reversed } =
    property?.application?.orbis?.display || {};

  const sliderProps = {
    colorMap: color,
    min: isRealValue(min) ? min : 0,
    max: isRealValue(max) ? max : 1,
    clipMin: filterRanges.clipRange[0],
    clipMax: filterRanges.clipRange[1],
    reversed: colormap_reversed,
    className: styles.slider,
  };

  return (
    <Grid container direction="column">
      {property.name === selectedProperty?.name ? (
        <Grid item xs={12}>
          <ToggleButtonGroup
            size="small"
            value={scale}
            onChange={handleToggleChange}
          >
            <ToggleButton value={SCALE_VALUES.filter}>
              {SCALE_VALUES.filter}
            </ToggleButton>
            <ToggleButton value={SCALE_VALUES.colour}>
              {SCALE_VALUES.colour}
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      ) : null}
      <Grid item>
        <Fade in={scale === SCALE_VALUES.filter} unmountOnExit>
          <ColormapRangeSlider
            {...sliderProps}
            data-testid="color-slider"
            value={filterRanges.filterRange}
            onChange={onRangeFilterChange}
          />
        </Fade>
        <Fade in={scale === SCALE_VALUES.colour} unmountOnExit>
          <ColorAdjustSlider
            {...sliderProps}
            data-testid="color-slider"
            onChange={onClipRangeChange}
          />
        </Fade>
      </Grid>
    </Grid>
  );
};

export default CrossFilterRadioPicker;
