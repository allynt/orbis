import {
  Fade,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@astrosat/astrosat-ui';
import { SidePanelSection } from 'components';
import { useChartTheme } from 'components/charts/useChartTheme';
import React, { useEffect, useMemo, useState } from 'react';
import { VictoryLabel, VictoryPie } from 'victory';

/** @type {import('typings/orbis').AnalysisPanelComponent<{info?: string}>} */
export const CategoryBreakdownChart = ({
  clickedFeatures,
  info,
  selectedProperty: selectedPropertyProp,
}) => {
  const chartTheme = useChartTheme();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState();
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
  useEffect(() => {
    if (
      !!selectedCategory &&
      (!categoryList.find(c => c.category === selectedCategory?.category) ||
        categoryList.length === 1)
    )
      setSelectedCategory(undefined);
  }, [categoryList, selectedCategory]);

  if (!clickedFeatures?.length) return null;

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
                      setSelectedCategory(c =>
                        c?.category === datum.category ? undefined : datum,
                      );
                    return [];
                  },
                },
              },
            ]}
            standalone={false}
            theme={chartTheme}
            animate
            padding={0}
            height={400}
            width={400}
            data={categoryList}
            y="percent"
            x="percent"
            style={{
              data: {
                fill: ({ datum }) => datum.color,
                cursor: categoryList.length > 1 ? 'pointer' : 'default',
              },
              labels: {
                textAnchor: 'middle',
                fill: ({ datum }) => theme.palette.getContrastText(datum.color),
              },
            }}
            padAngle={2}
            innerRadius={100}
            radius={({ datum }) =>
              selectedCategory?.category === datum.category ? 200 : 180
            }
            labels={({ datum }) => `${datum.percent.toFixed(2)}%`}
            labelRadius={({ innerRadius, datum }) =>
              datum.category === selectedCategory?.category
                ? (400 - Number(innerRadius)) / 2
                : 140
            }
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 24,
              fill: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
            }}
            x={200}
            y={200}
            text={`${
              !!selectedCategory ? `${selectedCategory?.count} / ` : ''
            }${clickedFeatures.length}\nArea${
              clickedFeatures.length > 1 ? 's' : ''
            }`}
          />
        </Grid>
        <Grid item xs={12} container spacing={0}>
          {categoryList.map(categoryInfo => (
            <Fade in key={categoryInfo.category}>
              <Grid item xs>
                <ListItem
                  selected={
                    categoryInfo.category === selectedCategory?.category
                  }
                >
                  <ListItemIcon
                    style={{
                      marginRight: theme.spacing(1),
                      minWidth: 'max-content',
                    }}
                  >
                    <span
                      style={{
                        width: '1rem',
                        height: '1rem',
                        backgroundColor: categoryInfo.color,
                        borderRadius: '50%',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={categoryInfo.category} />
                </ListItem>
              </Grid>
            </Fade>
          ))}
        </Grid>
      </Grid>
    </SidePanelSection>
  );
};
