import React from 'react';

import {
  makeStyles,
  Grid,
  FormControlLabel,
  Radio,
} from '@astrosat/astrosat-ui';

import { useSelector } from 'react-redux';

import {
  ColormapRangeSlider,
  InfoButtonTooltip,
  TooltipContent,
} from 'components';
import { isRealValue } from 'utils/isRealValue';

import {
  selectedPropertySelector,
  crossFilterValuesSelector,
  setFilterValue,
  setSelectedProperty,
} from '../crossfilter-layers.slice';

const useStyles = makeStyles(({ spacing, typography: { pxToRem } }) => ({
  radioIconContainer: {
    marginBottom: spacing(2),
  },
  slidersGridItem: {
    padding: spacing(2),
  },
  slider: {
    width: `calc(320px - ${spacing(6)})`,
    margin: spacing(1, 'auto', 2),
  },
}));

const CrossFilterRadioPicker = ({ selectedLayer, dispatch }) => {
  const styles = useStyles();
  const selectedProperty = useSelector(state =>
    selectedPropertySelector(state?.orbs),
  );

  const filterValues = useSelector(state =>
    crossFilterValuesSelector(state?.orbs),
  );

  /**
   * @param {string} propertyName
   * @param {number[]} filterValue
   */
  const handleSliderChange = (propertyName, filterValue) =>
    dispatch(
      setFilterValue({
        key: 'crossFilterValues',
        propertyName,
        filterValue,
      }),
    );

  /** @param {object} selectedProperty */
  const handleRadioClick = selectedProperty => {
    dispatch(
      setSelectedProperty({
        key: 'selectedProperty',
        selectedProperty,
      }),
    );
  };

  const categoryPath = '';

  return (
    <Grid container direction="column">
      {selectedLayer?.properties.map(property => {
        return (
          <Grid
            key={property.name}
            item
            container
            className={styles.slidersGridItem}
          >
            <Grid item container className={styles.radioIconContainer}>
              <Grid item xs={11}>
                <FormControlLabel
                  checked={selectedProperty.name === property.name}
                  label={property?.application?.orbis?.label || property?.label}
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
                        property?.application?.orbis?.description ||
                        property?.description
                      }
                    />
                  }
                />
              </Grid>
            </Grid>
            <Slider
              key={property.name}
              property={property}
              filterRange={filterValues[property.name]}
              onRangeFilterChange={filterValue =>
                handleSliderChange(property.name, filterValue)
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const Slider = ({ property, filterRange, onRangeFilterChange }) => {
  const styles = useStyles();

  const { min, max, precision } = property || {};

  const { color, colormap_reversed } =
    property?.application?.orbis?.display || {};

  const sliderProps = {
    colorMap: color,
    filterRange,
    min: isRealValue(min) ? min : 0,
    max: isRealValue(max) ? max : 1,
    clipMin: 22,
    clipMax: 38,
    reversed: colormap_reversed,
    className: styles.slider,
    precision,
    value: filterRange,
    'data-testid': 'color-slider',
    onChange: onRangeFilterChange,
  };

  return <ColormapRangeSlider {...sliderProps} />;
};

export default CrossFilterRadioPicker;
