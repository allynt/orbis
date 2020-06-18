import React from 'react';

import { render } from '@testing-library/react';

import { UserProfile } from './user-profile.component';

describe('UserProfile', () => {
  it('Shows the role "Administrator"', () => {
    const { getByText } = render(<UserProfile />);
    expect(getByText('Administrator')).toBeInTheDocument();
  });

  it('Shows the provided name', () => {
    const name = 'Test';
    const { getByText } = render(<UserProfile name={name} />);
    expect(getByText(name)).toBeInTheDocument();
  });

  it('Shows the provided user profile image', () => {
    const image = 'test.png';
    const { getByAltText } = render(<UserProfile avatar={image} />);
    expect(getByAltText('User Profile').getAttribute('src')).toBe(image);
  });

  it("Shows the default profile image if the user doesn't have one", () => {
    const { getByTitle } = render(<UserProfile />);
    expect(getByTitle('Profile Icon')).toBeInTheDocument();
  });
});
