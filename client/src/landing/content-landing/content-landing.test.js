import * as React from 'react';

import { render, userEvent } from 'test/test-utils';

import { ContentLanding } from './content-landing.component';

const VIEW_ALL = { name: /view all/i };
const HIDE_ALL = { name: /hide all/i };

const renderBookmarkComponent = (n = 10) => {
  const bookmarks = new Array(n).fill(undefined).map((_, i) => ({
    id: i,
    owner: `${i}e5ac533-0245-4031-ab65-b1eff4d30a1f`,
    title: `Bookmark Title ${i}`,
    description:
      'This is a description paragraph that describes the contents of this bookmark.',
    created: '2020-01-31T12:01:22.640053Z',
    thumbnail: 'test-image-URL',
  }));

  const utils = render(<ContentLanding bookmarks={bookmarks} />);
  return { ...utils };
};

const renderDashboardComponent = (n = 10) => {
  const dashboards = new Array(n).fill(undefined).map((_, i) => ({
    id: i,
    owner: `${i}e5ac533-0245-4031-ab65-b1eff4d30a1f`,
    title: `Bookmark Title ${i}`,
    thumbnail: 'test-image-URL',
  }));

  const utils = render(<ContentLanding dashboards={dashboards} />);
  return { ...utils };
};

describe('<ContentLanding />', () => {
  it('does not render the `View all` button if the number of bookmarks is 4 or less', () => {
    const { queryByRole } = renderBookmarkComponent(4);

    expect(queryByRole('button', VIEW_ALL)).not.toBeInTheDocument();
  });

  it('Changes `View all` to `Hide all` bookmarks when clicked', () => {
    const { getByRole, queryByRole } = renderBookmarkComponent();
    expect(getByRole('button', VIEW_ALL)).toBeInTheDocument();
    expect(queryByRole('button', HIDE_ALL)).not.toBeInTheDocument();
    userEvent.click(getByRole('button', VIEW_ALL));
    expect(queryByRole('button', VIEW_ALL)).not.toBeInTheDocument();
    expect(getByRole('button', HIDE_ALL)).toBeInTheDocument();
  });

  it('Changes `Your Maps` to `View All` when the view all button is clicked', () => {
    const { getByRole, getByText, queryByText } = renderBookmarkComponent();
    expect(getByText('Your Maps')).toBeInTheDocument();
    expect(queryByText('View All')).not.toBeInTheDocument();
    userEvent.click(getByRole('button', VIEW_ALL));
    expect(queryByText('Your Maps')).not.toBeInTheDocument();
    expect(getByText('View All')).toBeInTheDocument();
  });

  it('does not render the `View all` button if the number of dashboards is 4 or less', () => {
    const { queryByRole } = renderDashboardComponent(4);

    expect(queryByRole('button', VIEW_ALL)).not.toBeInTheDocument();
  });

  it('Changes `View all` to `Hide all` dashboard when clicked', () => {
    const { getByRole, queryByRole } = renderDashboardComponent();
    expect(getByRole('button', VIEW_ALL)).toBeInTheDocument();
    expect(queryByRole('button', HIDE_ALL)).not.toBeInTheDocument();
    userEvent.click(getByRole('button', VIEW_ALL));
    expect(queryByRole('button', VIEW_ALL)).not.toBeInTheDocument();
    expect(getByRole('button', HIDE_ALL)).toBeInTheDocument();
  });

  it('Changes `Your Dashboards` to `View All` when the view all button is clicked', () => {
    const { getByRole, getByText, queryByText } = renderDashboardComponent();
    expect(getByText('Your Dashboards')).toBeInTheDocument();
    expect(queryByText('View All')).not.toBeInTheDocument();
    userEvent.click(getByRole('button', VIEW_ALL));
    expect(queryByText('Your Dashboards')).not.toBeInTheDocument();
    expect(getByText('View All')).toBeInTheDocument();
  });
});
