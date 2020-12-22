import React from 'react';

import CorporateAccount from './corporate-account/corporate-account.component';
import AdministratorProfile from './adminstrator-profile/administrator-profile.component';

import { Box, Paper, styled, Typography } from '@astrosat/astrosat-ui';

const Title = styled(Typography)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.grey[400]}`,
  paddingBottom: '18px',
}));

const Wrapper = ({ children, title }) => (
  <Box component={Paper} elevation={5} p={4} width="100%" mb={3}>
    <Title variant="h1" gutterBottom>
      {title}
    </Title>
    {children}
  </Box>
);

const CorporateView = ({
  user,
  customer,
  updateCustomer,
  updateAdministrator,
}) => (
  <>
    <Wrapper title="Corporate Account">
      <CorporateAccount customer={customer} updateCustomer={updateCustomer} />
    </Wrapper>
    <Wrapper title="Administrator">
      <AdministratorProfile
        user={user}
        updateAdministrator={updateAdministrator}
      />
    </Wrapper>
  </>
);

export default CorporateView;
