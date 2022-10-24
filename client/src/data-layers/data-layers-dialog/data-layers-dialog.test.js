import * as React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DataLayersDialog from './data-layers-dialog.component';

const application = {
  orbis: {
    categories: {
      name: 'Test Parent Name',
      child: {
        name: 'Test Child Name',
      },
    },
    orbs: [
      {
        name: 'Test Orb Name',
      },
    ],
  },
};

const TEST_CHILD_NAME = /test child name/i;
const TEST_PARENT_NAME = /test parent name/i;
const ORB_1_SOURCE_1 = /orb 1 source 1/i;
const ORB_1_SOURCE_2 = /orb 1 source 2/i;
const TEST_2_PARENT_NAME = /test 2 parent name/i;

const SOURCES = [
  {
    source_id: 'orb/1/source/1',
    metadata: {
      label: 'Orb 1 Source 1',
      description: 'Orb 1 Source 1 description',
      application,
    },
  },
  {
    source_id: 'orb/1/source/2',
    metadata: {
      label: 'Orb 1 Source 2',
      description: 'Orb 1 Source 2 description',
      application,
    },
  },
  {
    source_id: 'orb/2/source/1',
    metadata: {
      label: 'Orb 2 Source 1',
      description: 'Orb 2 Source 1 description',
      application,
    },
  },
  {
    source_id: 'orb/2/source/2',
    metadata: {
      label: 'Orb 2 Source 2',
      description: 'Orb 2 Source 2 description',
      application,
    },
  },
  {
    source_id: 'orb/2/source/1',
    metadata: {
      label: 'search me',
      description: 'search me description',
      application: {
        orbis: {
          categories: {
            name: 'Test 2 Parent Name',
            child: {
              name: 'Test Child Name 2',
            },
          },
          orbs: [
            {
              name: 'Test Orb Name',
            },
          ],
        },
      },
    },
  },
];

jest.setTimeout(60000);

const renderComponent = ({ selectedSources = [] } = {}) => {
  const onSubmit = jest.fn();
  const close = jest.fn();
  const utils = render(
    <DataLayersDialog
      sources={SOURCES}
      onSubmit={onSubmit}
      close={close}
      open
      initialSelectedSources={selectedSources}
    />,
  );
  return { ...utils, onSubmit, close };
};

describe('<DataLayersDialog />', () => {
  it('calls close when the background is clicked', () => {
    const { getByRole, close } = renderComponent();
    userEvent.click(getByRole('none'));
    expect(close).toHaveBeenCalled();
  });

  it('Shows the sources for the selected orb', () => {
    const { getByRole, getByText } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));

    expect(getByText('Test Parent Name')).toBeInTheDocument();
  });

  it('Calls on confirm click with the selected sources', () => {
    const { getByRole, onSubmit } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));
    userEvent.click(
      getByRole('button', {
        name: TEST_PARENT_NAME,
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: TEST_CHILD_NAME,
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: ORB_1_SOURCE_1,
      }),
    );
    userEvent.click(getByRole('button', { name: /confirm/i }));
    expect(onSubmit).toHaveBeenCalledWith(['orb/1/source/1']);
  });

  it('Calls onSubmit with selected sources without deselected sources', () => {
    const { getByRole, onSubmit } = renderComponent({
      selectedSources: ['orb/1/source/1'],
    });

    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));
    userEvent.click(
      getByRole('button', {
        name: TEST_PARENT_NAME,
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: TEST_CHILD_NAME,
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: ORB_1_SOURCE_1,
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: ORB_1_SOURCE_2,
      }),
    );

    userEvent.click(getByRole('button', { name: /confirm/i }));
    expect(onSubmit).toHaveBeenCalledWith(['orb/1/source/2']);
  });

  it('Does not remove sources which have not been deselected', async () => {
    const { getByRole, onSubmit } = renderComponent({
      selectedSources: ['orb/1/source/1'],
    });

    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));
    userEvent.click(
      getByRole('button', {
        name: TEST_PARENT_NAME,
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: TEST_CHILD_NAME,
      }),
    );
    userEvent.click(
      getByRole('button', {
        name: ORB_1_SOURCE_2,
      }),
    );

    userEvent.click(getByRole('button', { name: /confirm/i }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith([
        'orb/1/source/1',
        'orb/1/source/2',
      ]),
    );
  });

  it('filters sources if names/descriptions are included in search term', () => {
    const { getByPlaceholderText, getByRole, queryByText } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));

    expect(
      getByRole('button', {
        name: TEST_PARENT_NAME,
      }),
    ).toBeInTheDocument();
    expect(
      getByRole('button', {
        name: TEST_2_PARENT_NAME,
      }),
    ).toBeInTheDocument();

    userEvent.type(getByPlaceholderText('Search for data layers'), 'search me');

    expect(queryByText('Test Parent Name')).not.toBeInTheDocument();
  });

  it('shows message if no layers match search term', () => {
    const { getByPlaceholderText, getByRole, getByText } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));

    userEvent.type(
      getByPlaceholderText('Search for data layers'),
      'random text',
    );

    expect(getByText('No results found for this keyword')).toBeInTheDocument();
  });

  it('restores sources if search input is cleared', () => {
    const { getByPlaceholderText, getByRole, getByText } = renderComponent();
    userEvent.click(getByRole('button', { name: 'Test Orb Name' }));

    userEvent.type(
      getByPlaceholderText('Search for data layers'),
      'random text',
    );

    expect(getByText('No results found for this keyword')).toBeInTheDocument();

    userEvent.clear(getByPlaceholderText('Search for data layers'));

    expect(
      getByRole('button', {
        name: TEST_PARENT_NAME,
      }),
    ).toBeInTheDocument();
    expect(
      getByRole('button', {
        name: TEST_2_PARENT_NAME,
      }),
    ).toBeInTheDocument();
  });
});
