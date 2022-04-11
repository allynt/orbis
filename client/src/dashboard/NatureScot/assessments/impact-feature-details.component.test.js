import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { TabPanel } from '../tab-panel';
import ImpactFeatureDetails from './impact-feature-details.component';

describe('Impact Feature Details', () => {
  describe('Tabbed Panel', () => {
    it('should display a tab panel', () => {
      render(
        <TabPanel value={0} index={0}>
          Visible Panel
        </TabPanel>,
      );

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
      expect(screen.getByText(/visible panel/i)).toBeInTheDocument();
    });

    it('should not display a tab panel', () => {
      render(
        <TabPanel value={0} index={1}>
          Invisible Panel
        </TabPanel>,
      );

      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
      expect(screen.queryByText(/visible panel/i)).not.toBeInTheDocument();
    });
  });
  describe('Feature Detail Nav', () => {
    it('should display a tab list', () => {
      render(<ImpactFeatureDetails />);

      expect(
        screen.getByRole('tablist', { name: /impact details by feature/i }),
      ).toBeInTheDocument();

      // 3 tab navigation
      expect(screen.getAllByRole('tab').length).toBe(8);

      // Only one panel visible.
      expect(screen.getAllByRole('tabpanel').length).toBe(1);
    });

    it('should switch between tabs', () => {
      render(<ImpactFeatureDetails />);

      expect(
        screen.getByRole('tab', { name: /Breeding Bird Assemblage/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Breeding Bird Assemblage')).toBeInTheDocument();

      userEvent.click(screen.getByRole('tab', { name: /Watersources/i }));

      expect(screen.getByText('Build a culvert')).toBeInTheDocument();
      expect(screen.queryByText('This is not in here')).not.toBeInTheDocument();
    });
  });
});
