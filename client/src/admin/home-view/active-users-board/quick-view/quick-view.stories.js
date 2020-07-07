import React from 'react';

import QuickView from './quick-view.component';

export default { title: 'Admin/QuickView', component: QuickView };

const licenceData = {
  active: 3,
  pending: 4,
  available: 5,
};

export const NoData = () => <QuickView licenceData={undefined} />;

export const SomeDataButNotAll = () => (
  <QuickView
    licenceData={{
      active: null,
      pending: undefined,
      available: 5,
    }}
  />
);

export const Default = () => <QuickView licenceData={licenceData} />;
