import React from 'react';

import { screen, render, waitFor } from '@testing-library/react';

import { ProgressIndicatorChart } from './progress-indicator-chart.component';

const defaultFormatCenterDisplay = ({ percentage, target }) => {
  // console.log('percentage in TEST: ', percentage);
  return !!percentage || percentage === 0 ? (
    <>
      <span>{percentage}%</span>
      <span>Target {target} Units</span>
    </>
  ) : (
    <span>Error message</span>
  );
};

const renderComponent = ({ property, domain }) =>
  render(
    <ProgressIndicatorChart
      property={property}
      formatCenterDisplay={params =>
        defaultFormatCenterDisplay({ ...params, ...property })
      }
      domain={domain}
    />,
  );

describe('Target Progress Indicator', () => {
  describe.only('default domain range (0 - 100)', () => {
    it('calculates percentage values,', async () => {
      const property = {
        target: 400,
        progress: 100,
      };

      renderComponent({ property });

      await waitFor(() => {
        expect(screen.getAllByText('25%')[0]).toBeInTheDocument();
        expect(screen.getByText('Target 400 Units')).toBeInTheDocument();
      });
    });

    it('shows 100% when target is 0,', async () => {
      const property = {
        target: 0,
        progress: 150,
      };

      renderComponent({ property });

      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('Target 0 Units')).toBeInTheDocument();
      });
    });

    it('shows 0% when progress is 0,', async () => {
      const property = {
        target: 150,
        progress: 0,
      };

      renderComponent({ property });

      await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('Target 150 Units')).toBeInTheDocument();
      });
    });

    it('shows 100% if both targets and progress are 0,', async () => {
      const property = {
        target: 0,
        progress: 0,
      };

      renderComponent({ property });

      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('Target 0 Units')).toBeInTheDocument();
      });
    });
  });

  describe('custom domain range', () => {
    it('calculates percentages with custom domain range', async () => {
      const property = {
        target: 30,
        progress: 15,
      };

      renderComponent({ property, domain: { min: 10, max: 40 } });

      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('Target 30 Units')).toBeInTheDocument();
      });
    });

    it('shows 100% when target is domain minimum', async () => {
      const property = {
        target: 10,
        progress: 15,
      };

      renderComponent({ property, domain: { min: 10, max: 40 } });

      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('Target 10 Units')).toBeInTheDocument();
      });
    });

    it('shows 0% when progress is domain minimum', async () => {
      const property = {
        target: 15,
        progress: 10,
      };

      renderComponent({ property, domain: { min: 10, max: 40 } });

      await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('Target 15 Units')).toBeInTheDocument();
      });
    });

    it('shows 100% when target and progress are domain minimum', async () => {
      const property = {
        target: 10,
        progress: 10,
      };

      renderComponent({ property, domain: { min: 10, max: 40 } });

      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('Target 10 Units')).toBeInTheDocument();
      });
    });
  });

  describe('error state', () => {
    it('shows error message when target is undefined', () => {
      const property = { progress: 100, target: undefined };

      renderComponent({ property });

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows error message when target is less than 0', () => {
      const property = { progress: 100, target: -10 };

      renderComponent({ property });

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows error message when target is less than domain min', () => {
      const property = { progress: 100, target: 5 };

      renderComponent({ property, domain: { min: 10, max: 20 } });

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows error message when progress is undefined', () => {
      const property = { target: 100, progress: undefined };

      renderComponent({ property });

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows error message when progress is null', () => {
      const property = { target: 100, progress: null };

      renderComponent({ property });

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows error message when progress is NaN', () => {
      const property = { target: 100, progress: NaN };

      renderComponent({ property });

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows error message when progress is less than domain min', () => {
      const property = { target: 100, progress: 5 };

      renderComponent({ property, domain: { min: 10, max: 20 } });

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });
});
