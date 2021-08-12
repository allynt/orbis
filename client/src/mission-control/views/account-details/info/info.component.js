import React from 'react';

import { styled, Typography } from '@astrosat/astrosat-ui';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3, 5, 2),
}));

const Label = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightLight,
  marginBottom: theme.spacing(0.5),
}));

/**
 * @param {{
 *  userName: string
 *  organisationName: string
 *  organisationId: string
 *  className?: string
 * }} props
 */
export const Info = ({
  userName,
  organisationName,
  organisationId,
  className,
}) => (
  <Wrapper className={className}>
    <Typography variant="h2" gutterBottom>
      {userName}
    </Typography>
    <Label>Organisation Name</Label>
    <Typography variant="h3" style={{ marginBottom: '0.5rem' }}>
      {organisationName}
    </Typography>
    <Label>ID Number</Label>
    <Typography variant="h3">{organisationId}</Typography>
  </Wrapper>
);
