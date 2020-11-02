import React from 'react';

import { render } from '@testing-library/react';

import { LayerSelect } from './layer-select.component';
import userEvent from '@testing-library/user-event';

const BUTTON = /confirm/i;

/**@type {import('./layer-select.component').OrbSources} */
const ORB_SOURCES = [
  {
    category: 'Oil',
    sources: [
      { source_id: 'oil/source/1', metadata: { label: 'Oil Source 1' } },
      { source_id: 'oil/source/2', metadata: { label: 'Oil Source 2' } },
    ],
  },
  {
    category: 'Gas',
    sources: [
      { source_id: 'gas/source/1', metadata: { label: 'Gas Source 1' } },
      { source_id: 'gas/source/2', metadata: { label: 'Gas Source 2' } },
    ],
  },
];

/**@type {import('./layer-select.component').OrbSources} */
const ORB_SOURCES_SUB_CATEGORIES = [
  {
    category: 'Oil and Gas',
    sources: [
      {
        category: 'Oil',
        sources: [
          { source_id: 'oil/source/1', metadata: { label: 'Oil Source 1' } },
          { source_id: 'oil/source/2', metadata: { label: 'Oil Source 2' } },
        ],
      },
      {
        category: 'Gas',
        sources: [
          { source_id: 'gas/source/1', metadata: { label: 'Gas Source 1' } },
          { source_id: 'gas/source/2', metadata: { label: 'Gas Source 2' } },
        ],
      },
    ],
  },
];

const renderComponent = ({
  orbSources = ORB_SOURCES,
  hasMadeChanges = false,
} = {}) => {
  const onSourceChange = jest.fn();
  const onAcceptClick = jest.fn();
  const utils = render(
    <LayerSelect
      orbSources={orbSources}
      onSourceChange={onSourceChange}
      onAcceptClick={onAcceptClick}
      hasMadeChanges={hasMadeChanges}
    />,
  );
  return { ...utils, onSourceChange };
};

describe('<LayerSelect />', () => {
  it('shows text when no orb is selected', () => {
    const { getByText } = renderComponent({ orbSources: null });
    expect(
      getByText('Select Your Orb in order to find layers'),
    ).toBeInTheDocument();
  });

  it('disables the button when no changes have been made', () => {
    const { getByRole } = renderComponent();
    expect(getByRole('button', { name: BUTTON })).toBeDisabled();
  });

  it('shows category headings', () => {
    const { getByRole } = renderComponent();
    expect(
      getByRole('button', { name: ORB_SOURCES[0].category }),
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: ORB_SOURCES[1].category }),
    ).toBeInTheDocument();
  });

  it('expands the category headings when clicked', () => {
    const { getByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: ORB_SOURCES[0].category }));
    expect(
      getByRole('checkbox', { name: ORB_SOURCES[0].sources[0].metadata.label }),
    ).toBeVisible();
  });

  it('hides categories when heading is clicked again', () => {
    const { getByRole, queryByRole } = renderComponent();
    userEvent.click(getByRole('button', { name: ORB_SOURCES[0].category }));
    expect(
      getByRole('checkbox', { name: ORB_SOURCES[0].sources[0].metadata.label }),
    ).toBeVisible();
    userEvent.click(getByRole('button', { name: ORB_SOURCES[0].category }));
    expect(
      queryByRole('checkbox', {
        name: ORB_SOURCES[0].sources[0].metadata.label,
      }),
    ).not.toBeVisible();
  });

  it('shows sub-category headings', () => {
    const { getByRole } = renderComponent({
      orbSources: ORB_SOURCES_SUB_CATEGORIES,
    });
    expect(
      getByRole('button', {
        name: ORB_SOURCES_SUB_CATEGORIES[0].sources[0].category,
      }),
    ).toBeInTheDocument();
  });

  it('expands sub-category headings when clicked', () => {
    const { getByRole } = renderComponent({
      orbSources: ORB_SOURCES_SUB_CATEGORIES,
    });
    userEvent.click(
      getByRole('button', { name: ORB_SOURCES_SUB_CATEGORIES[0].category }),
    );
    userEvent.click(
      getByRole('button', {
        name: ORB_SOURCES_SUB_CATEGORIES[0].sources[0].category,
      }),
    );
    expect(
      getByRole('checkbox', {
        name:
          ORB_SOURCES_SUB_CATEGORIES[0].sources[0].sources[0].metadata.label,
      }),
    ).toBeVisible();
  });

  it('hides sub-categories when heading is clicked again', () => {
    const { getByRole } = renderComponent({
      orbSources: ORB_SOURCES_SUB_CATEGORIES,
    });
    const categoryHeading = getByRole('button', {
      name: ORB_SOURCES_SUB_CATEGORIES[0].category,
    });
    const subCategoryHeading = getByRole('button', {
      name: ORB_SOURCES_SUB_CATEGORIES[0].sources[0].category,
    });
    const checkbox = getByRole('checkbox', {
      name: ORB_SOURCES_SUB_CATEGORIES[0].sources[0].sources[0].metadata.label,
    });
    userEvent.click(categoryHeading);
    userEvent.click(subCategoryHeading);
    expect(checkbox).toBeVisible();
    userEvent.click(subCategoryHeading);
    expect(checkbox).not.toBeVisible();
  });

  it('calls onSourceChange when a source is clicked', () => {
    const { getByRole, onSourceChange } = renderComponent();
    userEvent.click(getByRole('button', { name: ORB_SOURCES[0].category }));
    userEvent.click(
      getByRole('checkbox', { name: ORB_SOURCES[0].sources[0].metadata.label }),
    );
    expect(onSourceChange).toHaveBeenCalled();
  });

  it('enables the submit button when changes have been made', () => {
    const { getByRole } = renderComponent({ hasMadeChanges: true });
    expect(getByRole('button', { name: BUTTON })).not.toBeDisabled();
  });
});
