import React from 'react';

import { render, waitFor } from '@testing-library/react';

import { LayerSelect } from './layer-select.component';
import userEvent from '@testing-library/user-event';

const SUBMIT_BUTTON = /confirm/i;
const SELECT_ALL = /^select\sall/i;
const UNSELECT_ALL = /unselect\sall/i;

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
  selectedSources = [],
} = {}) => {
  const onSourceChange = jest.fn();
  const onSourcesChange = jest.fn();
  const onSearchChange = jest.fn();
  const onSubmit = jest.fn();
  const utils = render(
    <LayerSelect
      orbSources={orbSources}
      selectedSources={selectedSources}
      onSourceChange={onSourceChange}
      onSourcesChange={onSourcesChange}
      onSearchChange={onSearchChange}
      onSubmit={onSubmit}
      hasMadeChanges={hasMadeChanges}
    />,
  );
  return { ...utils, onSourceChange, onSourcesChange, onSearchChange };
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
    expect(getByRole('button', { name: SUBMIT_BUTTON })).toBeDisabled();
  });

  it('shows category headings', () => {
    const { getByRole } = renderComponent();
    expect(
      getByRole('button', { name: new RegExp(ORB_SOURCES[0].category) }),
    ).toBeInTheDocument();
    expect(
      getByRole('button', { name: new RegExp(ORB_SOURCES[1].category) }),
    ).toBeInTheDocument();
  });

  it('expands the category headings when clicked', () => {
    const { getByRole } = renderComponent();
    userEvent.click(
      getByRole('button', {
        name: new RegExp(ORB_SOURCES[0].category),
      }),
    );
    expect(
      getByRole('button', {
        name: ORB_SOURCES[0].sources[0].metadata.label,
      }),
    ).toBeInTheDocument();
  });

  it('hides categories when heading is clicked again', async () => {
    const { getByRole, queryByRole } = renderComponent();
    userEvent.click(
      getByRole('button', { name: new RegExp(ORB_SOURCES[0].category) }),
    );
    expect(
      queryByRole('button', {
        name: ORB_SOURCES[0].sources[0].metadata.label,
      }),
    ).toBeInTheDocument();
    userEvent.click(getByRole('button', { name: /oil \(/i }));
    await waitFor(() =>
      expect(
        queryByRole('button', {
          name: ORB_SOURCES[0].sources[0].metadata.label,
        }),
      ).not.toBeInTheDocument(),
    );
  });

  it('shows sub-category headings', () => {
    const { getByRole } = renderComponent({
      orbSources: ORB_SOURCES_SUB_CATEGORIES,
    });
    userEvent.click(
      getByRole('button', {
        name: new RegExp(ORB_SOURCES_SUB_CATEGORIES[0].category),
      }),
    );
    expect(
      getByRole('button', {
        name: /oil \(/i,
      }),
    ).toBeInTheDocument();
  });

  it('expands sub-category headings when clicked', async () => {
    const { getByRole } = renderComponent({
      orbSources: ORB_SOURCES_SUB_CATEGORIES,
    });
    userEvent.click(
      getByRole('button', {
        name: new RegExp(ORB_SOURCES_SUB_CATEGORIES[0].category),
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: /oil \(/i,
      }),
    );
    const checkbox = getByRole('button', {
      name: ORB_SOURCES_SUB_CATEGORIES[0].sources[0].sources[0].metadata.label,
    });
    await waitFor(() => expect(checkbox).toBeInTheDocument());
  });

  it('hides sub-categories when heading is clicked again', async () => {
    const { getByRole, queryByRole } = renderComponent({
      orbSources: ORB_SOURCES_SUB_CATEGORIES,
    });
    const categoryHeading = getByRole('button', {
      name: new RegExp(ORB_SOURCES_SUB_CATEGORIES[0].category),
    });

    userEvent.click(categoryHeading);
    const subCategoryHeading = getByRole('button', {
      name: /oil \(/i,
    });
    userEvent.click(subCategoryHeading);
    expect(
      getByRole('button', {
        name:
          ORB_SOURCES_SUB_CATEGORIES[0].sources[0].sources[0].metadata.label,
      }),
    ).toBeInTheDocument();
    userEvent.click(subCategoryHeading);
    await waitFor(() =>
      expect(
        queryByRole('button', {
          name:
            ORB_SOURCES_SUB_CATEGORIES[0].sources[0].sources[0].metadata.label,
        }),
      ).not.toBeInTheDocument(),
    );
  });

  it('calls onSourceChange when a source is clicked', async () => {
    const { getByRole, onSourcesChange } = renderComponent();
    userEvent.click(
      getByRole('button', { name: new RegExp(ORB_SOURCES[0].category) }),
    );
    userEvent.click(
      getByRole('button', {
        name: ORB_SOURCES[0].sources[0].metadata.label,
      }),
    );
    await waitFor(() => expect(onSourcesChange).toHaveBeenCalled());
  });

  it('enables the submit button when changes have been made', () => {
    const { getByRole } = renderComponent({ hasMadeChanges: true });
    expect(getByRole('button', { name: SUBMIT_BUTTON })).not.toBeDisabled();
  });

  it('shows the count of selected layers in a category', () => {
    const { getAllByText } = renderComponent({
      selectedSources: ['oil/source/1'],
    });
    expect(getAllByText('(1/2)')).toHaveLength(1);
  });

  describe('Select All', () => {
    it('calls onSourcesChange with all sources within a category when "Select All"  is clicked', () => {
      const { onSourcesChange, getAllByRole } = renderComponent();
      userEvent.click(getAllByRole('button', { name: SELECT_ALL })[0]);
      expect(onSourcesChange).toHaveBeenCalledWith({
        source_ids: ['oil/source/1', 'oil/source/2'],
        selected: true,
      });
    });

    it('calls onSourcesChange with all sources within a sub-category when "Select All" is clicked', () => {
      const { onSourcesChange, getByRole, getAllByRole } = renderComponent({
        orbSources: ORB_SOURCES_SUB_CATEGORIES,
      });
      userEvent.click(
        getByRole('button', {
          name: new RegExp(ORB_SOURCES_SUB_CATEGORIES[0].category),
        }),
      );
      userEvent.click(getAllByRole('button', { name: SELECT_ALL })[1]);
      expect(onSourcesChange).toHaveBeenCalledWith({
        source_ids: ['oil/source/1', 'oil/source/2'],
        selected: true,
      });
    });

    it('calls onSourcesChange with all sources within a category when "Unselect All" is clicked', () => {
      const { onSourcesChange, getAllByRole } = renderComponent({
        selectedSources: ['oil/source/1', 'oil/source/2'],
      });
      userEvent.click(getAllByRole('button', { name: UNSELECT_ALL })[1]);
      expect(onSourcesChange).toHaveBeenCalledWith({
        source_ids: ['oil/source/1', 'oil/source/2'],
        selected: false,
      });
    });

    it('calls onSourcesChange with all sources within a sub-category when "Unselect All" is clicked', () => {
      const { onSourcesChange, getByRole, getAllByRole } = renderComponent({
        orbSources: ORB_SOURCES_SUB_CATEGORIES,
        selectedSources: ['oil/source/1', 'oil/source/2'],
      });
      userEvent.click(
        getByRole('button', {
          name: new RegExp(ORB_SOURCES_SUB_CATEGORIES[0].category),
        }),
      );
      userEvent.click(getAllByRole('button', { name: UNSELECT_ALL })[1]);
      expect(onSourcesChange).toHaveBeenCalledWith({
        source_ids: ['oil/source/1', 'oil/source/2'],
        selected: false,
      });
    });

    it('calls onSourcesChange with only the sources which have changed', () => {
      const { onSourcesChange, getAllByRole } = renderComponent({
        selectedSources: ['oil/source/1'],
      });
      userEvent.click(getAllByRole('button', { name: SELECT_ALL })[0]);
      expect(onSourcesChange).toHaveBeenCalledWith({
        source_ids: ['oil/source/2'],
        selected: true,
      });
    });
  });

  describe('Search Input', () => {
    it('calls search handler on every keystroke', () => {
      const { getByPlaceholderText, onSearchChange } = renderComponent();
      userEvent.type(getByPlaceholderText('Search for data layers'), 'Test');
      expect(onSearchChange).toHaveBeenCalledTimes(4);
    });
  });
});
