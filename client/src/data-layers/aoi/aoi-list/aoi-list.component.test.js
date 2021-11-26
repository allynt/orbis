import React from 'react';

import { render, screen } from 'test/test-utils';

import AoiList from './aoi-list.component';

const AOIS = [
  {
    id: 1,
    name: 'AOI Title 1',
    description: 'AOI Description 1',
    thumbnail: 'AOI Thumbnail Image 1',
  },
  {
    id: 2,
    name: 'AOI Title 2',
    description: 'AOI Description 2',
    thumbnail: 'AOI Thumbnail Image 2',
  },
];

describe('Bookmark List Component', () => {
  let aois = null;
  let selectAoi = null;
  let editAoiDetails = null;
  let deleteAoi = null;

  beforeEach(() => {
    aois = AOIS;

    selectAoi = jest.fn();
    editAoiDetails = jest.fn();
    deleteAoi = jest.fn();
  });

  it('should render the `No Saved AOIs` message', () => {
    render(
      <AoiList
        aois={[]}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    expect(screen.getByText('No Saved AOIs')).toBeInTheDocument();
  });

  it('should render a list of AOIs', () => {
    render(
      <AoiList
        aois={aois}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    const aoiItems = screen.getAllByRole('listitem');

    expect(aoiItems.length).toBe(2);
  });
});
