import * as React from 'react';

import { render, screen } from 'test/test-utils';

import { PldSidebarComponent } from './sidebar.component';

const CONSTRUCTION_PHASES = [
  {
    icon: 'Circle',
    value: 'Approved',
    bgColor: '#75b7b2',
  },
  {
    icon: 'Circle',
    value: 'Commenced',
    bgColor: '#f52455',
  },
  {
    icon: 'Circle',
    value: 'Completed',
    bgColor: '#8aea73',
  },
];

const DEVELOPMENT_TYPES = [
  {
    icon: 'Conversion',
    value: 'Conversion',
  },
  {
    icon: 'NewBuild',
    value: 'New Build',
  },
  {
    icon: 'ChangeOfUse',
    value: 'Change of Use',
  },
  {
    icon: 'Extension',
    value: 'Extension',
  },
];

const DATE_TYPES = [
  {
    id: 'decision_date',
    label: 'Decision Date',
  },
  {
    id: 'actual_commencement_date',
    label: 'Commencement Date',
  },
  {
    id: 'actual_completion_date',
    label: 'Completion Date',
  },
  {
    id: 'appeal_decision_date',
    label: 'Appeal Decision Date',
  },
  {
    id: 'lapsed_date',
    label: 'Lapsed Date',
  },
];

describe('<PldSidebarComponent />', () => {
  it('Shows the results if there are any', () => {
    const selectedLayer = { source_id: 'test-source-id' };

    render(
      <PldSidebarComponent
        selectedLayer={selectedLayer}
        color="black"
        iconColor="white"
        constructionPhaseFilters={CONSTRUCTION_PHASES}
        developmentTypeFilters={DEVELOPMENT_TYPES}
        dateTypes={DATE_TYPES}
      />,
    );

    expect(
      screen.getByRole('heading', { name: /construction phase/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /approved/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /commenced/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /completed/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /development type/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /conversion/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /new build/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /change of use/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /extension/i }),
    ).toBeInTheDocument();
  });
});
