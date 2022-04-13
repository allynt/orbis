import React from 'react';

import { styled, Typography } from '@astrosat/astrosat-ui';

import { IMPACT_SUMMARY_LEGEND_DATA } from '../../nature-scotland.constants';

const LegendContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  width: '60%',
  height: '5rem',
  margin: '2rem 0 1.375rem auto',
  padding: theme.spacing(1.25),
  border: `1px solid ${theme.palette.background.default}`,
}));

const LegendItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const Icon = styled('span')(({ fill }) => ({
  display: 'block',
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  backgroundColor: fill,
}));

const NatureScotCustomLegend = () => (
  <LegendContainer>
    {Object.entries(IMPACT_SUMMARY_LEGEND_DATA).map(([label, fill]) => (
      <LegendItem key={label}>
        <Icon fill={fill} />
        <Typography variant="body1">{label}</Typography>
      </LegendItem>
    ))}
  </LegendContainer>
);

export { NatureScotCustomLegend };
