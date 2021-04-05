import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import { find } from 'lodash';
import { useSelector } from 'react-redux';

import { LegendItem, SidePanelSection } from 'components';
import { categoryListSelector } from 'map/orbs/slices/isolation-plus.slice';
import { Pie } from './pie.component';

export const isSelected = (datumA, datumB) =>
  datumA?.category === datumB?.category;

/** @type {import('typings/orbis').AnalysisPanelComponent<{info?: string}, import('typings/orbis').PickedMapFeature>} */
export const CategoryBreakdownChart = ({
  clickedFeatures,
  info,
  selectedProperty: selectedPropertyProp,
}) => {
  const selectedProperty = /** @type {import('typings/orbis').DiscreteProperty} */ (selectedPropertyProp);
  /** @type {[{category: string, count:number} | undefined, React.Dispatch<{category:string, count:number} | undefined>]} */
  const [selectedDatum, setSelectedDatum] = useState();

  const categoryList = useSelector(state => categoryListSelector(state?.orbs));

  useEffect(() => {
    if (
      !!selectedDatum &&
      (!find(categoryList, { category: selectedDatum.category }) ||
        categoryList.length === 1)
    )
      setSelectedDatum(undefined);
  }, [categoryList, selectedDatum]);

  if (!clickedFeatures?.length) return null;

  return (
    <SidePanelSection title="Selected Data Layer" info={info} defaultExpanded>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography paragraph>{selectedProperty?.label}</Typography>
        </Grid>
        <Grid item xs={12}>
          <ParentSize>
            {({ width }) => (
              <Pie
                width={width}
                categoryList={categoryList}
                onSegmentClick={datum => {
                  categoryList.length > 1 &&
                    setSelectedDatum(
                      isSelected(datum, selectedDatum) ? undefined : datum,
                    );
                }}
                selectedDatum={selectedDatum}
                precision={selectedProperty.precision}
                clickedFeatures={clickedFeatures}
              />
            )}
          </ParentSize>
        </Grid>
        <Grid item xs={12} container spacing={0}>
          {categoryList.map(categoryInfo => (
            <LegendItem
              key={categoryInfo.category}
              text={categoryInfo.category}
              color={categoryInfo?.color}
              selected={isSelected(categoryInfo, selectedDatum)}
            />
          ))}
        </Grid>
      </Grid>
    </SidePanelSection>
  );
};
