import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StyleSwitcherContent } from './map-style-switcher.component';

describe('MapStyle Switcher Component', () => {
  let testee = null;
  let selectMapStyle = null;
  let selectedMapStyle = null;

  const MAP_STYLE_DATA = {
    streets: { name: 'Streets', thumbnail: 'streets.jpg' },
    light: { name: 'Light', thumbnail: 'light.jpg' },
    dark: { name: 'Dark', thumbnail: 'dark.jpg' },
    satellite: { name: 'Satellite', thumbnail: 'satellite.jpg' },
  };

  beforeEach(() => {
    selectMapStyle = jest.fn();

    selectedMapStyle = Object.keys(MAP_STYLE_DATA)[1];

    testee = render(
      <StyleSwitcherContent
        mapStyles={MAP_STYLE_DATA}
        selectedMapStyle={selectedMapStyle}
        onInputChange={selectMapStyle}
      />,
    );
  });

  it.each(Object.keys(MAP_STYLE_DATA))('should render style %s', style => {
    expect(testee.getByLabelText(style, { exact: false })).toBeInTheDocument();
  });

  it('should render with the `Light` Map Style selected', () => {
    expect(testee.getByLabelText('Light')).toBeChecked();
  });

  it('should call the selectMapStyle with the `Dark` Map Style is selected', () => {
    expect(testee.getByLabelText('Dark')).not.toBeChecked();

    userEvent.click(testee.getByLabelText('Dark'), undefined, {
      skipPointerEventsCheck: true,
    });

    expect(selectMapStyle).toHaveBeenCalledWith(Object.keys(MAP_STYLE_DATA)[2]);
    expect(selectMapStyle).not.toHaveBeenCalledWith(
      Object.keys(MAP_STYLE_DATA)[1],
    );
  });
});
