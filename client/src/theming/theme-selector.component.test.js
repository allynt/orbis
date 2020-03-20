import React from 'react';

import { render, cleanup } from '@testing-library/react';
import selectEvent from 'react-select-event';

import ThemeSelector from './theme-selector.component';

describe('Theme Selector Component', () => {
  const THEMES = [
    {
      value: 'light',
      label: 'Light'
    },
    {
      value: 'dark',
      label: 'Dark'
    }
  ];

  let selectTheme = null;

  afterEach(cleanup);

  beforeEach(() => {
    selectTheme = jest.fn();
  });

  it('should render with the `Light` Theme selected', () => {
    const { container, getByText } = render(
      <ThemeSelector themes={THEMES} selectedTheme={THEMES[0]} selectTheme={selectTheme} />
    );

    expect(getByText('Theme:')).toBeInTheDocument();
    expect(container.querySelector('.select')).toBeInTheDocument();
    expect(getByText('Light')).toBeInTheDocument();
  });

  it('should render with the `Dark` Theme selected', () => {
    const { container, getByText } = render(
      <ThemeSelector themes={THEMES} selectedTheme={THEMES[1]} selectTheme={selectTheme} />
    );

    expect(getByText('Theme:')).toBeInTheDocument();
    expect(container.querySelector('.select')).toBeInTheDocument();
    expect(getByText('Dark')).toBeInTheDocument();
  });

  xit('should switch from the `Light` to `Dark` Theme', async () => {
    const { container, getByTestId, getByText, asFragment, debug, getByLabelText } = render(
      <ThemeSelector themes={THEMES} selectedTheme={THEMES[0]} selectTheme={selectTheme} />
    );
    debug();
    await selectEvent.select(getByLabelText('Theme:'), 'Dark');
    expect(selectTheme).toHaveBeenCalled();
    // debug();
    // expect(container.querySelector('StateManager')).toBeInTheDocument();
    // asFragment().debug();
    // console.log('FRAGMENT: ', asFragment());

    //   expect(testee.find('Select').prop('value')).toEqual(selectedTheme);
    // });
    // it('should call the selectTheme with the `Light` Theme selected', () => {
    //   testee = shallow(
    //     <ThemeSelector
    //       themes={THEMES}
    //       selectedTheme={selectedTheme}
    //       selectTheme={selectTheme}
    //     />
    //   );
    //   testee
    //     .find('StateManager')
    //     .simulate('change', { target: { value: 'light' } });
    //   expect(selectTheme).toHaveBeenCalled();
  });
});
