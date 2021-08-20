import React from 'react';

import QuickView from './quick-view.component';

export default {
  title: 'Mission Control/Users View/QuickView',
  component: QuickView,
};

export const NoData = () => <QuickView />;

export const SomeDataButNotAll = () => (
  <QuickView activeUsers={null} pendingUsers={5} />
);

export const Default = () => <QuickView activeUsers={3} pendingUsers={4} />;
