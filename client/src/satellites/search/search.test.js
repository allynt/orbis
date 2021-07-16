import React from 'react';

import { render } from '@testing-library/react';

import Search from './search.component';

describe('<Search />', () => {
  it('Renders', () => {
    render(<Search />);
  });
});
