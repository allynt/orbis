import React from 'react';

import LeftSidebar from './left-sidebar.component';

export default { title: 'Admin/LeftSidebar', component: LeftSidebar };

export const Default = () => (
  <LeftSidebar
    user={{
      name: 'Henry Dillmond',
      avatar:
        'https://pbs.twimg.com/profile_images/1218555839826579458/GL8pjTKD_400x400.jpg',
    }}
  />
);
