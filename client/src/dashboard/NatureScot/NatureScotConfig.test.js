import React from 'react';

import { format } from 'date-fns';
import { rest } from 'msw';

import { server } from 'mocks/server';
import { render, screen, userEvent, waitFor } from 'test/test-utils';

import NatureScotDashboard from './NatureScotConfig.component';

server.use(
  rest.post('*', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
);

server.use(
  rest.get('*', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
);

const testProposal = {
  geometry: '123',
  report_generated: '2022-04-22T10:34:17.535848Z',
  modified: '2022-04-22T10:34:17.535848Z',
  report_state: {
    activities: [{ name: 'I am test activity' }],
    areas: [{ title: 'I am test area', areas: [] }],
  },
};

const renderComponent = ({
  proposals = [testProposal],
  impactAssessment = null,
}) => {
  const state = {
    data: { tokens: {} },
    aois: { selectedAoi: { geometry: '123' } },
    natureScotDashboard: {
      proposals,
      impactAssessment,
    },
  };

  const utils = render(<NatureScotDashboard sourceId={'123'} />, { state });
  return { ...utils };
};

describe('NatureScotDashboard', () => {
  it('renders', () => {
    renderComponent({});

    expect(screen.getByRole('tab', { name: 'Dashboard' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Start Impact Assessment' }),
    ).toBeInTheDocument();
  });

  it('opens Impact Assessment Form dialog', async () => {
    renderComponent({});

    userEvent.click(
      screen.getByRole('button', { name: 'Start Impact Assessment' }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Welcome to the Impact Assessment functionality for Eco-an-Alba.',
      }),
    ).toBeInTheDocument();
  });

  it('closes dialog', async () => {
    renderComponent({});

    const headingText =
      'Welcome to the Impact Assessment functionality for Eco-an-Alba.';

    userEvent.click(
      screen.getByRole('button', { name: 'Start Impact Assessment' }),
    );

    expect(
      screen.getByRole('heading', {
        name: headingText,
      }),
    ).toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', { name: 'impact-dialog-close-icon' }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', {
          name: headingText,
        }),
      ).not.toBeInTheDocument();
    });
  });

  it('switches to assessment tab', () => {
    renderComponent({});

    userEvent.click(screen.getByRole('tab', { name: 'Assessments' }));

    expect(
      screen.getByRole('button', { name: 'Export as PDF' }),
    ).toBeInTheDocument();
  });

  // TODO: skipped
  xit('opens results tab of form with previously saved results', async () => {
    renderComponent({});

    // open list of saved assessments
    userEvent.click(screen.getByRole('tab', { name: 'Assessments' }));

    // select an assessment
    const button = screen.getByRole('button', { name: 'View/Modify' });
    expect(button).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'View/Modify' }));

    const savedAssessmentDate = format(
      new Date(testProposal.report_generated),
      'PPPPpp',
    );

    //check report_generated date is of previously saved assessment
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: `Report generated at: ${savedAssessmentDate}`,
        }),
      ).toBeInTheDocument();
    });
  });

  it('prioritizes newly-fetched assessment results over previously saved', () => {
    renderComponent({ impactAssessment: {} });

    // open list of saved assessments
    userEvent.click(screen.getByRole('tab', { name: 'Assessments' }));

    // select an assessment
    userEvent.click(screen.getByRole('button', { name: 'View/Modify' }));

    // const ranAssessmentDate = format(new Date(), 'PPPPpp');
    const savedAssessmentDate = format(
      new Date(testProposal.report_generated),
      'PPPPpp',
    );

    // check report_generated date is of currently ran assessment
    expect(
      screen.queryByRole('heading', {
        name: `Report generated at: ${savedAssessmentDate}`,
      }),
    ).not.toBeInTheDocument();
  });

  // TODO: skipped
  xit('clears results for new assessment form', async () => {
    renderComponent({ impactAssessment: {} });

    const savedAssessmentDate = format(
      new Date(testProposal.report_generated),
      'PPPPpp',
    );

    // open list of saved assessments
    userEvent.click(screen.getByRole('tab', { name: 'Assessments' }));

    // select an assessment
    userEvent.click(screen.getByRole('button', { name: 'View/Modify' }));

    // check saved assessment date is not displaying
    expect(
      screen.queryByRole('heading', {
        name: `Report generated at: ${savedAssessmentDate}`,
      }),
    ).not.toBeInTheDocument();

    // close dialog
    userEvent.click(
      screen.getByRole('button', { name: 'impact-dialog-close-icon' }),
    );

    // re-open dialog/ navigate back to results
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'View/Modify' }));
    });

    //check report_generated date is of previously saved assessment
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: `Report generated at: ${savedAssessmentDate}`,
        }),
      ).toBeInTheDocument();
    });
  });
});
