import React from 'react';

import { render } from '@testing-library/react';
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
  const utils = render(
    <Visualisation
      visualisations={visualisations}
      onVisualisationClick={onVisualisationClick}
      onVisibilityChange={onVisibilityChange}
    />,
  );
  return { ...utils, onVisualisationClick, onVisibilityChange };
};

describe('Satellite Visualisation Component', () => {
  it('should render a list of visualisation options', () => {
    const { getByText, getAllByRole } = renderComponent();
    expect(getAllByRole('button')).toHaveLength(2);

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
});
