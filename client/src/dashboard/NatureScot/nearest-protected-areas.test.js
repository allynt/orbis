import React from 'react';

import { render, screen } from 'test/test-utils';

import { NearestProtectedAreas } from './nearest-protected-areas';

const data = [
  { name: 'Loch Lomond', type: 'National Park', distance: 4 },
  { name: 'Drumnadrochit', type: 'Protected Area', distance: 8 },
  { name: 'Ardnamurchan', type: 'Aviemore Place', distance: 12 },
];

describe('< NearestProtectedAreas/>', () => {
  it('should render the proper name of column header ', () => {
    render(<NearestProtectedAreas data={data} />);
    expect(
      screen.getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Type' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Distance' }),
    ).toBeInTheDocument();
  });

  it('should render the proper data in each cell ', () => {
    render(<NearestProtectedAreas data={data} />);
    const names = data.map(element => element.name);
    names.forEach(element => {
      expect(screen.getByText(element)).toBeInTheDocument();
    });
    const types = data.map(element => element.type);
    types.forEach(element => {
      expect(screen.getByText(element)).toBeInTheDocument();
    });
    const distances = data.map(element => element.distance);
    distances.forEach(element => {
      expect(screen.getByText(`${element} km`)).toBeInTheDocument();
    });
  });

  it('should render the proper table name ', () => {
    render(<NearestProtectedAreas data={data} />);
    expect(
      screen.getByRole('heading', { name: 'Nearest Protected Areas' }),
    ).toBeInTheDocument();
  });
});
