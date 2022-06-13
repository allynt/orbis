import React from 'react';

import { rest } from 'msw';

import { server } from 'mocks/server';
import { render, screen } from 'test/test-utils';

import H2OrbDashboard, { getPercentage } from './H2OrbConfig.component';

const renderComponent = () => {
  const state = {
    data: {
      tokens: {},
      sources: [
        {
          source_id: 'astrosat/h2orb/dashboard/latest',
        },
      ],
    },
  };

  const component = render(
    <H2OrbDashboard sourceId="astrosat/h2orb/dashboard/latest" />,
    { state },
  );
  return { ...component };
};

describe('H2Orb Dashboard', () => {
  beforeEach(() =>
    server.use(
      rest.get(
        '*/api/proxy/data/astrosat/h2orb/indicators/latest/*',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([{ id: '123' }]));
        },
      ),
    ),
  );

  it('should render a dashboard', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'H2Orb Dashboard' }),
    ).toBeInTheDocument();
  });

  describe('getPercentage()', () => {
    it('at minimum, should be 0', () => {
      expect(getPercentage(20, 100, 20)).toBe(0.0);
    });
    it('at maximum, should be 100', () => {
      expect(getPercentage(20, 120, 120)).toBe(100.0);
    });
    it('mid range, should be 50', () => {
      expect(getPercentage(1, 3, 2)).toBe(50.0);
    });
    it('below min, should be negative', () => {
      expect(getPercentage(0, 100, -2)).toBe(-2.0);
    });
    it('above max, should be >100', () => {
      expect(getPercentage(0, 100, 150)).toBeGreaterThan(100.0);
    });
  });
});
