import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import AoiListItem from './aoi-list-item.component';

describe('<AoiListItem />', () => {
  let aoi = null;
  let selectAoi = null;
  let editAoi = null;
  let deleteAoi = null;

  beforeEach(() => {
    aoi = {
      id: 1,
      name: 'Test Name',
      description: 'This is a test description',
      info: 'This is a test info',
    };

    selectAoi = jest.fn();
    editAoi = jest.fn();
    deleteAoi = jest.fn();
  });

  it('should display a single list item', () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoi={editAoi}
        deleteAoi={deleteAoi}
      />,
    );

    expect(screen.getByRole('img', { name: /info/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: aoi.name })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /explore\sarea/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /options/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(aoi.name)).toBeInTheDocument();
    expect(screen.getByText(aoi.description)).toBeInTheDocument();
  });

  it('should call selectAoi with the aoi when the `Explore Area` button is clicked', () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoi={editAoi}
        deleteAoi={deleteAoi}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /explore\sarea/i }));

    expect(selectAoi).toHaveBeenCalledWith(aoi);
  });

  it('should display info content when the `info` button is clicked', () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoi={editAoi}
        deleteAoi={deleteAoi}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /info/i }));

    expect(screen.getByText(aoi.info)).toBeInTheDocument();
  });

  it('should display context menu when the `options` button is clicked', () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoi={editAoi}
        deleteAoi={deleteAoi}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /options/i }));

    expect(screen.getByRole('menuitem', { name: /edit/i })).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /delete/i }),
    ).toBeInTheDocument();
  });

  it('should call editAoi with the aoi when the edit button is clicked', () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoi={editAoi}
        deleteAoi={deleteAoi}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /options/i }));
    userEvent.click(screen.getByRole('menuitem', { name: /edit/i }));

    expect(editAoi).toHaveBeenCalledWith(aoi);
  });

  it('should call deleteAoi with the aoi when the delete button is clicked', () => {
    render(
      <AoiListItem
        aoi={aoi}
        selectAoi={selectAoi}
        editAoi={editAoi}
        deleteAoi={deleteAoi}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /options/i }));
    userEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    expect(deleteAoi).toHaveBeenCalledWith(aoi);
  });
});
