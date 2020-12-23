import React from 'react';

import { Box } from '@astrosat/astrosat-ui';

import ContentWrapper from 'admin/content-wrapper.component';
import AdministratorProfile from './adminstrator-profile/administrator-profile.component';
import CorporateAccount from './corporate-account/corporate-account.component';

const CorporateView = ({
  user,
  customer,
  updateCustomer,
  updateAdministrator,
}) => (
  <Box display="flex" flexDirection="column">
    <ContentWrapper title="Corporate Account">
      <CorporateAccount customer={customer} updateCustomer={updateCustomer} />
    </ContentWrapper>
    <ContentWrapper title="Administrator">
      <AdministratorProfile
        user={user}
        updateAdministrator={updateAdministrator}
      />
    </ContentWrapper>
  </Box>
);

export default CorporateView;
