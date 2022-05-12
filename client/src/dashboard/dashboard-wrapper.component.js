import React from 'react';

import { Grid, Typography, styled } from '@astrosat/astrosat-ui';

const Wrapper = styled('div')(() => ({
  overflowY: 'scroll',
  width: '100%',
}));

const Header = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4),
  borderBottom: `1px solid ${theme.palette.primary.main}`,
}));

/**
 * @param {{
 *   title?: string
 *   HeaderComponent?: React.ReactNode
 *   children: React.ReactNode
 * }} props
 */
const DashboardWrapper = ({ title, HeaderComponent, children }) => (
  <Wrapper>
    {!!title || !!HeaderComponent ? (
      <Header
        container
        justifyContent={
          !!HeaderComponent && !!title ? 'space-between' : 'flex-start'
        }
        alignItems="center"
      >
        {!!title ? <Typography variant="h2">{title}</Typography> : null}
        {!!HeaderComponent ? HeaderComponent : null}
      </Header>
    ) : null}
    {children}
  </Wrapper>
);

export default DashboardWrapper;
