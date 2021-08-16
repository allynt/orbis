import React from 'react';

import { styled, Typography } from '@astrosat/astrosat-ui';

const Wrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3, 5, 2),
}));

const Label = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightLight,
  marginBottom: theme.spacing(0.5),
}));

const Value = styled(Typography)(({ theme }) => ({
  '&:first-of-type': {
    marginBottom: theme.spacing(1),
  },
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
    {organisationName && (
      <>
        <Label>Organisation Name</Label>
        <Value variant="h3">{organisationName}</Value>
      </>
    )}
    <Label>ID Number</Label>
    <Value variant="h3">{organisationId}</Value>
  </Wrapper>
);
