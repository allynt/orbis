import React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

import { ParentSize } from '@visx/responsive';
import { VictoryPie } from 'victory';

import { useAnalysisPanelContext } from 'analysis-panel/analysis-panel-context';
import { SidePanelSection } from 'components';
import { useChartTheme } from 'hooks/useChartTheme';
import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';

import { LegendItem } from '../legend-item/legend-item.component';

/**
 *
 * @typedef {{
 *   info?: string
 * }} PropertyBreakdownChartProps
 */

/** @type {import('typings').AnalysisPanelComponent<PropertyBreakdownChartProps} */
export const PropertyBreakdownChart = ({ selectedProperty, info }) => {
  const { colors, ...chartTheme } = useChartTheme();

  const { breakdownAggregation } = useAnalysisPanelContext();

  if (!breakdownAggregation?.length) return null;
  return (
    <SidePanelSection title="Breakdown" defaultExpanded info={info}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ParentSize>
            {({ width }) => {
              const radius = width / 2 - width * 0.1,
                innerRadius = width * 0.2,
                labelRadius = (radius + innerRadius) / 2;

              return (
                <svg viewBox={`0 0 ${width} ${width}`}>
                  <VictoryPie
                    width={width}
                    height={width}
                    animate={{
                      onLoad: { duration: 500 },
                      // @ts-ignore
                      animationWhitelist: [
                        'style',
                        'data',
                        'radius',
                        'innerRadius',
                        'labelRadius',
                      ],
                    }}
                    standalone={false}
                    theme={chartTheme}
                    data={breakdownAggregation}
                    radius={radius}
                    innerRadius={innerRadius}
                    padAngle={2}
                    x="value"
                    y="value"
                    labels={({ datum }) =>
                      datum?.value?.toFixed(
                        selectedProperty.precision ?? DEFAULT_DECIMAL_PRECISION,
                      )
                    }
                    labelRadius={labelRadius}
                  />
                </svg>
              );
            }}
          </ParentSize>
        </Grid>
        <Grid item xs={12} container spacing={1}>
          {breakdownAggregation?.map(({ name }, i) => (
            <LegendItem
              key={name}
              text={name}
              color={colors[i % colors.length]}
            />
          ))}
        </Grid>
      </Grid>
    </SidePanelSection>
  );
};
