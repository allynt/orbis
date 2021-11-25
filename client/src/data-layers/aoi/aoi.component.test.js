import React from 'react';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import Aoi from './aoi.component';

describe('AOI Component', () => {
  let onDrawAoiClick = null;
  let onSubmit = null;
  let aoiDrawMode = null;
  let setAoiDrawMode = null;
  let fetchAois = null;
  let selectAoi = null;
  let editAoiDetails = null;
  let deleteAoi = null;

  let state = null;

  beforeEach(() => {
    onDrawAoiClick = jest.fn();
    onSubmit = jest.fn();
    aoiDrawMode = false;
    setAoiDrawMode = jest.fn();
    fetchAois = jest.fn();
    selectAoi = jest.fn();
    editAoiDetails = jest.fn();
    deleteAoi = jest.fn();

    state = {
      aois: {
        aoi: {},
      },
    };
  });

  it('should display the panel', () => {
    render(
      <Aoi
        onDrawAoiClick={onDrawAoiClick}
        onSubmit={onSubmit}
        aoiDrawMode={aoiDrawMode}
        setAoiDrawMode={setAoiDrawMode}
        fetchAois={fetchAois}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Please select the Area Of Interest on the map to search for available data.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Point' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Circle' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should call `onDrawAoiClick` function when `AOI Mode` button clicked', () => {
    render(
      <Aoi
        onDrawAoiClick={onDrawAoiClick}
        onSubmit={onSubmit}
        aoiDrawMode={aoiDrawMode}
        setAoiDrawMode={setAoiDrawMode}
        fetchAois={fetchAois}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: 'Circle' }));

    expect(onDrawAoiClick).toHaveBeenCalled();
  });

  it('should show dialog when `Save` button clicked', async () => {
    render(
      <Aoi
        onDrawAoiClick={onDrawAoiClick}
        onSubmit={onSubmit}
        aoiDrawMode={aoiDrawMode}
        setAoiDrawMode={setAoiDrawMode}
        fetchAois={fetchAois}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
      { state: state },
    );

    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Name Your Aoi' }),
      ).toBeInTheDocument(),
    );
  });
});
