import React from 'react';

import { UserProfile } from './user-profile.component';

export default { title: 'Admin/LeftSidebar/UserProfile', component: UserProfile };

export const NoUser = () => <UserProfile />;

export const NoAvatar = () => <UserProfile name="Henry Dillmond" />;

export const NameAndAvatar = () => (
  <UserProfile
    name="Henry Dillmond"
    avatar="https://pbs.twimg.com/profile_images/1218555839826579458/GL8pjTKD_400x400.jpg"
  />
);
