import React from 'react';

import { act } from '@testing-library/react-hooks';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import AoiListItem from './aoi-list-item.component';

describe('<AoiListItem />', () => {
  let aoi = null;
  let selectAoi = null;
  let editAoiDetails = null;
  let deleteAoi = null;

  beforeEach(() => {
    aoi = {
      id: 1,
      name: 'Test Name',
      description: 'This is a test description',
    };

    selectAoi = jest.fn();
    editAoiDetails = jest.fn();
    deleteAoi = jest.fn();
  });

  it('should display a single list item', async () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /info/i })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: aoi.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /explore\sarea/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /options/i }),
      ).toBeInTheDocument();

      expect(screen.getByText(aoi.name)).toBeInTheDocument();
    });
  });

  it('should call selectAoi with the aoi when the `Explore Area` button is clicked', async () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /explore\sarea/i }));
    });
    await waitFor(() => {
      expect(selectAoi).toHaveBeenCalledWith(aoi);
    });
  });

  it('should display info content when the `info` button is clicked', async () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    act(() => userEvent.click(screen.getByRole('button', { name: /info/i })));
    await waitFor(() => {
      expect(screen.getByText(aoi.description)).toBeInTheDocument();
    });
  });

  it('should display context menu when the `options` button is clicked', async () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /options/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: /edit/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /delete/i }),
      ).toBeInTheDocument();
    });
  });

  it('should call editAoiDetails with the aoi when the edit button is clicked', async () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /options/i }));
      userEvent.click(screen.getByRole('menuitem', { name: /edit/i }));
    });

    await waitFor(() => {
      expect(editAoiDetails).toHaveBeenCalledWith(aoi);
    });
  });

  it('should call deleteAoi with the aoi when the delete button is clicked', async () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoiDetails={editAoiDetails}
        deleteAoi={deleteAoi}
      />,
    );

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /options/i }));
      userEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    });

    await waitFor(() => {
      expect(deleteAoi).toHaveBeenCalledWith(aoi);
    });
  });
});
