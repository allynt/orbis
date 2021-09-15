import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import { find } from 'lodash';

import { SidePanelSection } from 'components';

import { LegendItem } from '../legend-item/legend-item.component';
import { Pie } from './pie.component';

export const isSelected = (datumA, datumB) =>
  datumA?.category === datumB?.category;

/** @type {import('typings').AnalysisPanelComponent<{info?: string}, import('typings').PickedMapFeature>} */
export const CategoryBreakdownChart = ({
  clickedFeatures,
  info,
  selectedProperty: selectedPropertyProp,
}) => {
  const selectedProperty = /** @type {import('typings').DiscreteProperty} */ (selectedPropertyProp);
  /** @type {[{category: string, count:number} | undefined, React.Dispatch<{category:string, count:number} | undefined>]} */
  const [selectedDatum, setSelectedDatum] = useState();

  const categoryList = Object.entries(selectedProperty.categories)
    .map(([category, rest]) => {
      const count = clickedFeatures?.reduce(
        (prev, curr) =>
          curr.object.properties[selectedProperty.name] === category
            ? prev + 1
            : prev,
        0,
      );
      const percent = (count / clickedFeatures?.length) * 100;
      return { category, count, percent, ...rest };
    })
    .filter(c => c.count > 0)
    .sort((a, b) => a.category.localeCompare(b.category));

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
