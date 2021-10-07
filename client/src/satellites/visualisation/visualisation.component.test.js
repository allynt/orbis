import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Visualisation from './visualisation.component';

const VISUALISATIONS = [
  {
    id: 1,
    label: 'Visualisation One',
    description: 'Visualisation One Description',
    thumbnail: '/test-thumbnail-1.png',
  },
  {
    id: 2,
    label: 'Visualisation Two',
    description: 'Visualisation Two Description',
    thumbnail: '/test-thumbnail-2.png',
  },
];

const renderComponent = (visualisations = VISUALISATIONS) => {
  const onVisualisationClick = jest.fn();
  const onVisibilityChange = jest.fn();
  const onSaveImageSubmit = jest.fn();
  const utils = render(
    <Visualisation
      visualisations={visualisations}
      onVisualisationClick={onVisualisationClick}
      onVisibilityChange={onVisibilityChange}
      onSaveImageSubmit={onSaveImageSubmit}
    />,
  );
  return {
    ...utils,
    onVisualisationClick,
    onVisibilityChange,
    onSaveImageSubmit,
  };
};

describe('Satellite Visualisation Component', () => {
  it('should render a list of visualisation options', () => {
    const { getByText, getAllByRole } = renderComponent();
    expect(
      getAllByRole('button', { name: /Scene Visualisation Thumbnail/i }),
    ).toHaveLength(2);

    VISUALISATIONS.forEach(visualisation => {
      expect(getByText(visualisation.label)).toBeInTheDocument();
      expect(getByText(visualisation.description)).toBeInTheDocument();
    });
  });

  it("Shows nothing if there's no visualisations", () => {
    const { queryByRole } = renderComponent(null);
    expect(queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('Calls onVisualisationClick when a visualisation is clicked', () => {
    const { getAllByRole, onVisualisationClick } = renderComponent();
    userEvent.click(getAllByRole('button')[0]);
    expect(onVisualisationClick).toBeCalledWith(VISUALISATIONS[0].id);
  });

  it('Calls onVisibilityChange with the visibility state when clicked', () => {
    const { getAllByRole, onVisibilityChange } = renderComponent();
    userEvent.click(getAllByRole('checkbox', { name: 'Hide' })[0]);
    expect(onVisibilityChange).toBeCalledWith(false);
  });

  it('Calls onSaveImageSubmit when the save image form is submitted', async () => {
    const expected = {
      name: 'Test Name',
      description: 'Test Description',
    };
    const { getByRole, onSaveImageSubmit } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Save Image' }));
    expect(getByRole('dialog')).toBeVisible();
    userEvent.type(getByRole('textbox', { name: 'Add Name' }), expected.name);
    userEvent.type(
      getByRole('textbox', { name: 'Add Description' }),
      expected.description,
    );
    userEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSaveImageSubmit).toBeCalledWith(expected));
    expect(getByRole('dialog')).not.toBeVisible();
  });

  it('Closes the save image form when clicked off', () => {
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Save Image' }));
    expect(getByRole('dialog')).toBeVisible();
    userEvent.click(getByRole('none'));
    expect(getByRole('dialog')).not.toBeVisible();
  });

  it('Closes the save image form when the close button is clicked', () => {
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Save Image' }));
    expect(getByRole('dialog')).toBeVisible();
    userEvent.click(getByRole('button', { name: /Close/i }));
    expect(getByRole('dialog')).not.toBeVisible();
  });
});
