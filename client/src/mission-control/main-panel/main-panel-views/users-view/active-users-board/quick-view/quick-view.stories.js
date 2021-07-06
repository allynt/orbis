import React from 'react';

import QuickView from './quick-view.component';

export default {
  title: 'Mission Control/Users View/Active Users Board/QuickView',
  component: QuickView,
};

const data = {
  active: 3,
  pending: 4,
  available: 5,
};

export const NoData = () => <QuickView data={undefined} />;

export const SomeDataButNotAll = () => (
  <QuickView
    data={{
      active: null,
      pending: undefined,
      available: 5,
    }}
  />
);

export const Default = () => <QuickView data={data} />;
