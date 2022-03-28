import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import ImpactFeatureDetailsNav, {
  TabPanel,
} from './impact-feature-details-nav.component';

describe('Impact Feature Details Nav', () => {
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
      render(<ImpactFeatureDetailsNav />);

      expect(
        screen.getByRole('tablist', { name: /impact details by feature/i }),
      ).toBeInTheDocument();

      // 3 tab navigation
      expect(screen.getAllByRole('tab').length).toBe(3);

      // Only one panel visible.
      expect(screen.getAllByRole('tabpanel').length).toBe(1);
    });

    it('should switch between tabs', () => {
      render(<ImpactFeatureDetailsNav />);

      expect(
        screen.getByRole('tab', { name: /item one/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Item Content One')).toBeInTheDocument();
      expect(screen.queryByText('Item Content Two')).not.toBeInTheDocument();

      userEvent.click(screen.getByRole('tab', { name: /item two/i }));

      expect(screen.getByText('Item Content Two')).toBeInTheDocument();
      expect(screen.queryByText('Item Content One')).not.toBeInTheDocument();
    });
  });
});
