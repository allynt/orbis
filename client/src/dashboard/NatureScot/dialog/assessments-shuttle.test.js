import React from 'react';

import { rest } from 'msw';

import { server } from 'mocks/server';
import { render, screen, userEvent, within } from 'test/test-utils';

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

  const rightActivityList = screen.getByRole('heading', {
    name: 'Selected Activities',
  }).parentElement;

  return { ...utils, setValue, rightActivityList };
};

describe('AssessmentsShuttle', () => {
  it('renders', () => {
    setup({});
    expect(screen.getByText('Available Activities')).toBeInTheDocument();
  });

  it('copies individual activities from left to right', () => {
    const { rightActivityList } = setup({ initialActivities: null });

    expect(
      within(rightActivityList).queryByRole('listitem', { name: 'title-1' }),
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('listitem', { name: 'title-1' }));
    userEvent.click(screen.getByTestId('choose-activity'));

    expect(
      within(rightActivityList).queryByRole('listitem', { name: 'title-1' }),
    ).toBeInTheDocument();
  });

  it('transfers all available activities from left to right', () => {
    const { rightActivityList } = setup({ initialActivities: null });
    const titles = ['title-1', 'title-2', 'title-3'];

    titles.forEach(title =>
      expect(
        within(rightActivityList).queryByRole('listitem', { name: title }),
      ).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));

    titles.forEach(title =>
      expect(
        within(rightActivityList).getByRole('listitem', { name: title }),
      ).toBeInTheDocument(),
    );
  });

  it('Transfers all search result activities from left to right', () => {
    server.use(
      rest.post(
        '*/api/proxy/data/ns/proxy/activities/latest/',
        (req, res, ctx) => res(ctx.status(200)),
      ),
    );

    const { rightActivityList } = setup({ state: typeAheadState });

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');

    expect(
      within(rightActivityList).queryByRole('listitem', { name: 'result-2' }),
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));

    expect(
      within(rightActivityList).getByRole('listitem', { name: 'result-2' }),
    ).toBeInTheDocument();
  });

  it('only transfers from left not already in right', () => {
    const { rightActivityList } = setup({
      initialActivities: [{ title: 'title-2', code: '2' }],
    });

    const nonSelectedTitles = ['title-1', 'title-3'];

    nonSelectedTitles.forEach(title =>
      expect(
        within(rightActivityList).queryByRole('listitem', { name: title }),
      ).not.toBeInTheDocument(),
    );

    expect(
      within(rightActivityList).getAllByRole('listitem', { name: 'title-2' })
        .length,
    ).toEqual(1);

    userEvent.click(screen.getByRole('button', { name: 'Choose all' }));

    ['title-2', ...nonSelectedTitles].forEach(title =>
      expect(
        within(rightActivityList).queryAllByRole('listitem', { name: title })
          .length,
      ).toEqual(1),
    );
  });

  it('deletes from right', () => {
    const { rightActivityList } = setup({
      initialActivities: [
        { title: 'title-1', code: '1' },
        { title: 'title-2', code: '2' },
      ],
    });

    const listItem = within(rightActivityList).getByRole('listitem', {
      name: 'title-2',
    });

    expect(listItem).toBeInTheDocument();
    userEvent.click(within(listItem).getByRole('button', { name: 'Delete' }));
    expect(listItem).not.toBeInTheDocument();
  });

  it('deletes all from right', () => {
    const { rightActivityList } = setup({
      initialActivities: [
        { title: 'title-2', code: '2' },
        { title: 'title-3', code: '3' },
      ],
    });

    const titles = ['title-2', 'title-3'];

    titles.forEach(title =>
      expect(
        within(rightActivityList).getByRole('listitem', { name: title }),
      ).toBeInTheDocument(),
    );

    userEvent.click(screen.getByRole('button', { name: 'Remove all' }));

    titles.forEach(title =>
      expect(
        within(rightActivityList).queryByRole('listitem', { name: title }),
      ).not.toBeInTheDocument(),
    );
  });

  it('replaces default activities with type-ahead', () => {
    server.use(
      rest.post(
        '*/api/proxy/data/ns/proxy/activities/latest/',
        (req, res, ctx) => res(ctx.status(200)),
      ),
    );

    setup({ state: typeAheadState });

    expect(
      screen.queryByRole('listitem', { name: 'result-1' }),
    ).not.toBeInTheDocument();

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');

    expect(
      screen.getByRole('listitem', { name: 'result-1' }),
    ).toBeInTheDocument();
  });

  it('reverts to defaults when no search text', () => {
    server.use(
      rest.post(
        '*/api/proxy/data/ns/proxy/activities/latest/',
        (req, res, ctx) => res(ctx.status(200)),
      ),
    );

    setup({ state: typeAheadState, initialActivities: null });

    userEvent.type(screen.getByPlaceholderText('Search for Activities'), 'a');

    expect(
      screen.getByRole('listitem', { name: 'result-1' }),
    ).toBeInTheDocument();

    userEvent.clear(screen.getByPlaceholderText('Search for Activities'));
    expect(
      screen.getByRole('listitem', { name: 'title-1' }),
    ).toBeInTheDocument();
  });

  it('adds custom activities', () => {
    setup({});

    userEvent.type(
      screen.getByPlaceholderText('Add a new activity'),
      'test activity',
    );

    userEvent.click(screen.getByTestId('add-activity'));

    expect(
      screen.getByRole('listitem', { name: 'test activity' }),
    ).toBeInTheDocument();
  });

  it('calls setValue when activities are added', () => {
    const { setValue } = setup({ initialActivities: null });

    userEvent.click(screen.getByRole('listitem', { name: 'title-1' }));
    userEvent.click(screen.getByTestId('choose-activity'));

    expect(setValue).toHaveBeenCalled();
  });

  it('calls setValue when an activity is removed', () => {
    const { setValue } = setup({});
    userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(setValue).toHaveBeenCalled();
  });
});
