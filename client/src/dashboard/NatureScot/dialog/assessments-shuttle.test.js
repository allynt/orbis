import React from 'react';

import fetch from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from 'test/test-utils';

import AssessmentsShuttle from './assessments-shuttle.component';

const typeAheadState = {
  natureScotDashboard: {
    activities: new Array(3).fill(undefined).map((_, i) => ({
      title: `result-${i + 1}`,
      code: `${i + 1}`,
    })),
  },
};

const activities = new Array(3).fill(undefined).map((_, i) => ({
  title: `title-${i + 1}`,
  code: `${i + 1}`,
}));

const setup = ({
  availableActivities = activities,
  initialActivities = activities,
  state = {},
}) => {
  const setValue = jest.fn();
  const utils = render(
    <AssessmentsShuttle
      setValue={setValue}
      availableActivities={availableActivities}
      initialActivities={initialActivities}
    />,
    { state },
  );
  return { ...utils, setValue };
};

describe('AssessmentsShuttle', () => {
  it('renders', () => {
    setup({});
    expect(screen.getByText('Available Activities')).toBeInTheDocument();
  });

  it('copies individual activities from left to right', () => {
    setup({ initialActivities: null });

    expect(screen.getAllByText('title-1').length).toEqual(1);

    userEvent.click(screen.getByText('title-1'));
    userEvent.click(screen.getByTestId('arrow-icon'));

    expect(screen.getAllByText('title-1').length).toEqual(2);
  });

  it('transfers all activities from left to right', () => {
    setup({ initialActivities: null });
    const titles = ['title-1', 'title-2', 'title-3'];

    titles.forEach(title =>
      expect(screen.getAllByText(title).length).toEqual(1),
    );

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));

    titles.forEach(title =>
      expect(screen.getAllByText(title).length).toEqual(2),
    );
  });

  it('only transfers left not already in right', () => {
    setup({ initialActivities: [{ title: 'title-2', code: '2' }] });

    expect(screen.getAllByText('title-2').length).toEqual(2);

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));

    expect(screen.getAllByText('title-2').length).toEqual(2);
  });

  it('deletes from right', () => {
    setup({ initialActivities: [{ title: 'title-2', code: '2' }] });

    expect(screen.getAllByText('title-2').length).toEqual(2);

    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getAllByText('title-2').length).toEqual(1);
  });

  it('deletes all from right', () => {
    setup({
      initialActivities: [
        { title: 'title-2', code: '2' },
        { title: 'title-3', code: '3' },
      ],
    });

    const titles = ['title-2', 'title-3'];

    titles.forEach(title =>
      expect(screen.getAllByText(title).length).toEqual(2),
    );

    userEvent.click(screen.getByRole('button', { name: 'Remove all' }));

    titles.forEach(title =>
      expect(screen.getAllByText(title).length).toEqual(1),
    );
  });

  it('replaces default activities with type-ahead', () => {
    fetch.once(JSON.stringify([]));
    setup({ state: typeAheadState });

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');

    expect(screen.getByText('result-1')).toBeInTheDocument();
  });

  it('reverts to defaults when no search text', () => {
    fetch.once(JSON.stringify([]));
    setup({ state: typeAheadState });

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');
    waitFor(() => {
      expect(screen.getByText('result-1')).toBeInTheDocument();
      expect(screen.getByText('title-1')).not.toBeInTheDocument();
    });

    userEvent.clear(screen.getByPlaceholderText('Search for Activities'));
    waitFor(() => {
      expect(screen.getByText('title-1')).toBeInTheDocument();
      expect(screen.getByText('result-1')).not.toBeInTheDocument();
    });
  });

  it('adds custom activities', () => {
    setup({});
    userEvent.type(
      screen.getByPlaceholderText('Add a new activity'),
      'test activity',
    );
    userEvent.click(screen.getByTestId('cross-icon'));

    expect(screen.getByText('test activity')).toBeInTheDocument();
  });

  it('calls setValue when activities are added', () => {
    const { setValue } = setup({ initialActivities: null });

    userEvent.click(screen.getByText('title-1'));
    userEvent.click(screen.getByTestId('arrow-icon'));

    expect(setValue).toHaveBeenCalled();
  });

  it('calls setValue when activities are removed', () => {
    const { setValue } = setup({});
    userEvent.click(screen.getAllByText('Delete')[0]);
    expect(setValue).toHaveBeenCalled();
  });
});
