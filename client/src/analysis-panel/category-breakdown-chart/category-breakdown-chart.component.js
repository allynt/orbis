import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Grid, Typography, useTheme } from '@astrosat/astrosat-ui';

import { VictoryLabel, VictoryPie } from 'victory';

import { SidePanelSection } from 'components';
import { useChartTheme } from 'components/charts/useChartTheme';
import { LegendItem } from './legend-item.component';

const WIDTH = 400,
  HEIGHT = 400,
  RADIUS_MODIFIER = 20,
  RADIUS_SELECTED = WIDTH / 2,
  RADIUS = RADIUS_SELECTED - RADIUS_MODIFIER,
  RADIUS_INNER = 90,
  RADIUS_LABEL = 134,
  RADIUS_LABEL_SELECTED = (WIDTH - RADIUS_INNER - 16) / 2;

/** @type {import('typings/orbis').AnalysisPanelComponent<{info?: string}, import('typings/orbis').PickedMapFeature>} */
export const CategoryBreakdownChart = ({
  clickedFeatures,
  info,
  selectedProperty: selectedPropertyProp,
}) => {
  const selectedProperty = /** @type {import('typings/orbis').DiscreteProperty} */ (selectedPropertyProp);
  const chartTheme = useChartTheme();
  const theme = useTheme();
  /** @type {[{category: string, count:number} | undefined, React.Dispatch<{category:string, count:number} | undefined>]} */
  const [selectedDatum, setSelectedDatum] = useState();

  const categoryList = useMemo(
    () =>
      Object.entries(selectedProperty.categories)
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
        .sort((a, b) => a.category.localeCompare(b.category)),
    [clickedFeatures, selectedProperty.categories, selectedProperty.name],
  );

  const isSelected = useCallback(
    ({ category }) => selectedDatum?.category === category,
    [selectedDatum],
  );

  useEffect(() => {
    if (
      !!selectedDatum &&
      (!categoryList.find(isSelected) || categoryList.length === 1)
    )
      setSelectedDatum(undefined);
  }, [categoryList, selectedDatum, isSelected]);

  if (!clickedFeatures?.length) return null;

  /** @type {import('victory-core').VictoryStyleInterface} */
  const pieStyle = {
    data: {
      fill: ({ datum }) => datum.color,
      cursor: categoryList.length > 1 ? 'pointer' : 'default',
    },
    labels: {
      textAnchor: 'middle',
      /** @type {import('victory-core').VictoryStringCallback} */
      fill: ({ datum }) => theme.palette.getContrastText(datum.color),
    },
  };

  /** @type {import('victory-core').VictoryNumberCallback} */
  const getRadius = ({ datum }) =>
    isSelected(datum) ? RADIUS_SELECTED : RADIUS;

  /** @type {import('victory-core').VictoryStringCallback} */
  const getLabels = ({ datum }) => `${datum.percent.toFixed(2)}%`;

  /** @param {import('victory').SliceProps} props */
  const getLabelRadius = ({ datum }) =>
    isSelected(datum) ? RADIUS_LABEL_SELECTED : RADIUS_LABEL;

  const labelText = `${!!selectedDatum ? `${selectedDatum?.count} / ` : ''}${
    clickedFeatures.length
  }\nArea${clickedFeatures.length > 1 ? 's' : ''}`;

  /** @type {import('victory-core').VictoryLabelStyleObject} */
  const labelStyle = {
    fontSize: 24,
    fill: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    textAnchor: 'middle',
  };

  return (
    <SidePanelSection title="Selected Data Layer" info={info} defaultExpanded>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography paragraph>{selectedProperty?.label}</Typography>
        </Grid>
        <Grid item xs={12} component="svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          <VictoryPie
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: (_, { datum }) => {
                    categoryList.length > 1 &&
                      setSelectedDatum(isSelected(datum) ? undefined : datum);
                    return [];
                  },
                },
              },
            ]}
            standalone={false}
            theme={chartTheme}
            animate
            padding={0}
            width={WIDTH}
            height={HEIGHT}
            data={categoryList}
            y="percent"
            x="percent"
            style={pieStyle}
            padAngle={2}
            innerRadius={RADIUS_INNER}
            radius={getRadius}
            labels={getLabels}
            labelRadius={getLabelRadius}
          />
          <VictoryLabel
            style={labelStyle}
            x={WIDTH / 2}
            y={HEIGHT / 2}
            text={labelText}
          />
        </Grid>
        <Grid item xs={12} container spacing={0}>
          {categoryList.map(categoryInfo => (
            <LegendItem
              key={categoryInfo.category}
              categoryInfo={categoryInfo}
              selected={isSelected(categoryInfo)}
            />
          ))}
        </Grid>
      </Grid>
    </SidePanelSection>
  );
};
