import React from 'react';

import { rest } from 'msw';

import { server } from 'mocks/server';
import { render, screen, userEvent } from 'test/test-utils';

import { SEARCH_ACTIVITIES_URL } from '../nature-scotland.constants';
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

    expect(screen.getAllByRole('button', { name: 'title-1' }).length).toEqual(
      1,
    );

    userEvent.click(screen.getByRole('button', { name: 'title-1' }));
    userEvent.click(screen.getByTestId('choose-activity'));

    // TODO: here
    expect(screen.getAllByText('title-1').length).toEqual(2);
  });

  it('transfers all available activities from left to right', () => {
    setup({ initialActivities: null });
    const titles = ['title-1', 'title-2', 'title-3'];

    titles.forEach(title =>
      expect(screen.getAllByRole('button', { name: title }).length).toEqual(1),
    );

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));

    // TODO: here
    titles.forEach(title =>
      expect(screen.getAllByText(title).length).toEqual(2),
    );
  });

  it('Transfers all search result activities from left to right', () => {
    server.use(
      rest.get(SEARCH_ACTIVITIES_URL, (req, res, ctx) => res(ctx.status(200))),
    );

    setup({ state: typeAheadState });

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');
    expect(screen.getAllByRole('button', { name: 'result-2' }).length).toEqual(
      1,
    );

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));
    // TODO: here
    expect(screen.getAllByText('result-2').length).toEqual(2);
  });

  it('only transfers left not already in right', () => {
    setup({ initialActivities: [{ title: 'title-2', code: '2' }] });

    expect(screen.getAllByRole('button', { name: 'title-2' }).length).toEqual(
      1,
    );

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));

    // TODO: here
    expect(screen.getAllByText('title-2').length).toEqual(2);
  });

  it('deletes from right', () => {
    setup({ initialActivities: [{ title: 'title-2', code: '2' }] });

    // TODO: here
    expect(screen.getAllByText('title-2').length).toEqual(2);

    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getAllByRole('button', { name: 'title-2' }).length).toEqual(
      1,
    );
  });

  it('deletes all from right', () => {
    setup({
      initialActivities: [
        { title: 'title-2', code: '2' },
        { title: 'title-3', code: '3' },
      ],
    });

    const titles = ['title-2', 'title-3'];

    // TODO: here
    titles.forEach(title =>
      expect(screen.getAllByText(title).length).toEqual(2),
    );

    userEvent.click(screen.getByRole('button', { name: 'Remove all' }));

    titles.forEach(title =>
      expect(screen.getAllByRole('button', { name: title }).length).toEqual(1),
    );
  });

  it('replaces default activities with type-ahead', () => {
    server.use(
      rest.get(SEARCH_ACTIVITIES_URL, (req, res, ctx) => res(ctx.status(200))),
    );

    setup({ state: typeAheadState });

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');

    expect(
      screen.getByRole('button', { name: 'result-1' }),
    ).toBeInTheDocument();
  });

  it('reverts to defaults when no search text', () => {
    server.use(
      rest.get(SEARCH_ACTIVITIES_URL, (req, res, ctx) => res(ctx.status(200))),
    );

    setup({ state: typeAheadState, initialActivities: null });

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');
    expect(
      screen.getByRole('button', { name: 'result-1' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'title-1' }),
    ).not.toBeInTheDocument();

    userEvent.clear(screen.getByPlaceholderText('Search for Activities'));
    expect(screen.getByRole('button', { name: 'title-1' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'result-1' }),
    ).not.toBeInTheDocument();
  });

  it('adds custom activities', () => {
    setup({});

    userEvent.type(
      screen.getByPlaceholderText('Add a new activity'),
      'test activity',
    );

    userEvent.click(screen.getByTestId('add-activity'));

    expect(
      screen.getByRole('button', { name: 'test activity Delete' }),
    ).toBeInTheDocument();
  });

  it('calls setValue when activities are added', () => {
    const { setValue } = setup({ initialActivities: null });

    userEvent.click(screen.getByRole('button', { name: 'title-1' }));
    userEvent.click(screen.getByTestId('choose-activity'));

    expect(setValue).toHaveBeenCalled();
  });

  it('calls setValue when activities are removed', () => {
    const { setValue } = setup({});
    userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(setValue).toHaveBeenCalled();
  });
});
