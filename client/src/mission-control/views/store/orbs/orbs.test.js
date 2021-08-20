import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { getBorderRadiuses, Orbs } from './orbs.component';

const orbs = [
  { id: 1, shortDescription: 'Orb 1 Short Description', logo: '' },
  { id: 2, shortDescription: 'Orb 2 Short Description', logo: '' },
  { id: 3, shortDescription: 'Orb 3 Short Description' },
];

const renderComponent = (isLoading = false) => {
  const history = createMemoryHistory();
  // @ts-ignore
  const utils = render(<Orbs orbs={orbs} isLoading={isLoading} />, {
    wrapper: ({ children }) => <Router history={history}>{children}</Router>,
  });
  return { ...utils, history };
};

describe('<Orbs />', () => {
  it('shows a tile for each orb', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('listitem')).toHaveLength(orbs.length);
  });

  it('navigates to the individual orb route when a link is clicked', () => {
    const { getAllByRole, history } = renderComponent();
    userEvent.click(getAllByRole('link', { name: /Learn More/i })[0]);
    expect(history.location.pathname).toContain(orbs[0].id);
  });

  it('Shows skeletons if loading', () => {
    const { getAllByRole } = renderComponent(true);
    expect(getAllByRole('listitem')).toHaveLength(3);
  });
});

const makeExpected = (tl, tr, br, bl) => ({
  borderTopLeftRadius: tl,
  borderTopRightRadius: tr,
  borderBottomRightRadius: br,
  borderBottomLeftRadius: bl,
});

describe('getBorderRadiuses', () => {
  it.each`
    total | index | columns | max               | expected
    ${1}  | ${0}  | ${3}    | ${{ x: 0, y: 0 }} | ${makeExpected(10, 10, 10, 10)}
    ${2}  | ${0}  | ${3}    | ${{ x: 1, y: 0 }} | ${makeExpected(10, 0, 0, 10)}
    ${2}  | ${1}  | ${3}    | ${{ x: 1, y: 0 }} | ${makeExpected(0, 10, 10, 0)}
    ${3}  | ${2}  | ${3}    | ${{ x: 1, y: 0 }} | ${makeExpected(0, 0, 0, 0)}
    ${4}  | ${0}  | ${3}    | ${{ x: 0, y: 1 }} | ${makeExpected(10, 0, 0, 0)}
    ${4}  | ${1}  | ${3}    | ${{ x: 0, y: 1 }} | ${makeExpected(0, 0, 0, 0)}
    ${4}  | ${2}  | ${3}    | ${{ x: 0, y: 1 }} | ${makeExpected(0, 10, 10, 0)}
    ${4}  | ${3}  | ${3}    | ${{ x: 0, y: 1 }} | ${makeExpected(0, 0, 10, 10)}
    ${7}  | ${0}  | ${3}    | ${{ x: 0, y: 2 }} | ${makeExpected(10, 0, 0, 0)}
    ${7}  | ${1}  | ${3}    | ${{ x: 0, y: 2 }} | ${makeExpected(0, 0, 0, 0)}
    ${7}  | ${2}  | ${3}    | ${{ x: 0, y: 2 }} | ${makeExpected(0, 10, 0, 0)}
    ${7}  | ${3}  | ${3}    | ${{ x: 0, y: 2 }} | ${makeExpected(0, 0, 0, 0)}
    ${7}  | ${4}  | ${3}    | ${{ x: 0, y: 2 }} | ${makeExpected(0, 0, 0, 0)}
    ${7}  | ${5}  | ${3}    | ${{ x: 0, y: 2 }} | ${makeExpected(0, 0, 10, 0)}
    ${7}  | ${6}  | ${3}    | ${{ x: 0, y: 2 }} | ${makeExpected(0, 0, 10, 10)}
    ${8}  | ${0}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(10, 0, 0, 0)}
    ${8}  | ${1}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(0, 0, 0, 0)}
    ${8}  | ${2}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(0, 10, 0, 0)}
    ${8}  | ${3}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(0, 0, 0, 0)}
    ${8}  | ${4}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(0, 0, 0, 0)}
    ${8}  | ${5}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(0, 0, 10, 0)}
    ${8}  | ${6}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(0, 0, 0, 10)}
    ${8}  | ${7}  | ${3}    | ${{ x: 1, y: 2 }} | ${makeExpected(0, 0, 10, 0)}
  `(
    'Returns the correct border radius configuration based on the index of the tile',
    ({ index, total, columns, max, expected }) => {
      expect(getBorderRadiuses(index, total, columns, max)).toEqual(expected);
    },
  );
});
