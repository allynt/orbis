import {
  Fade,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
  useTheme,
} from '@astrosat/astrosat-ui';
import { SidePanelSection } from 'components';
import { useChartTheme } from 'components/charts/useChartTheme';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VictoryLabel, VictoryPie } from 'victory';

const WIDTH = 400,
  HEIGHT = 400;

const useStyles = makeStyles(theme => ({
  listItemIcon: {
    marginRight: theme.spacing(1),
    minWidth: 'max-content',
  },
  colorCircle: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
  },
}));

const LegendItem = ({ categoryInfo, selected }) => {
  const styles = useStyles();
  return (
    <Fade in>
      <Grid item xs>
        <ListItem dense selected={selected}>
          <ListItemIcon className={styles.listItemIcon}>
            <span
              className={styles.colorCircle}
              style={{
                backgroundColor: categoryInfo.color,
              }}
            />
          </ListItemIcon>
          <ListItemText primary={categoryInfo.category} />
        </ListItem>
      </Grid>
    </Fade>
  );
};

/** @type {import('typings/orbis').AnalysisPanelComponent<{info?: string}, import('typings/orbis').PickedMapFeature>} */
export const CategoryBreakdownChart = ({
  clickedFeatures,
  info,
  selectedProperty: selectedPropertyProp,
}) => {
  const chartTheme = useChartTheme();
  const theme = useTheme();
  /** @type {[{category: string, count:number} | undefined, React.Dispatch<{category:string, count:number} | undefined>]} */
  const [selectedDatum, setSelectedDatum] = useState();
  const selectedProperty = /** @type {import('typings/orbis').DiscreteProperty} */ (selectedPropertyProp);

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
  const getRadius = ({ datum }) => (isSelected(datum) ? 200 : 180);

  /** @type {import('victory-core').VictoryStringCallback} */
  const getLabels = ({ datum }) => `${datum.percent.toFixed(2)}%`;

  /** @param {import('victory').SliceProps} props */
  const getLabelRadius = ({ innerRadius, datum }) =>
    isSelected(datum) ? (WIDTH - Number(innerRadius)) / 2 : 140;

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
        <Grid item xs={12} component="svg" viewBox="0 0 400 400">
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
            innerRadius={100}
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
