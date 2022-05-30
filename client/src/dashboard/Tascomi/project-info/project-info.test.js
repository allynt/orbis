import React from 'react';

import { render, screen } from 'test/test-utils';

import ProjectInfo, { getTotals } from './project-info.component';

describe('ProjectInfo', () => {
  it('renders', () => {
    render(<ProjectInfo selectedFeature={{}} />);

    expect(
      screen.getByRole('heading', { name: 'Reference Numbers' }),
    ).toBeInTheDocument();
  });

  it('maps out keys passed', () => {
    const selectedFeature = {
      'Application ID': 'ref number',
      'Site co-ordinates': 'coords',
      'Applicant name': 'name',
    };

    render(<ProjectInfo selectedFeature={selectedFeature} />);

    ['ref number', 'coords', 'name'].forEach(value =>
      expect(screen.getByText(value)).toBeInTheDocument(),
    );
  });

  describe('getTotals', () => {
    it('totals values', () => {
      const result = getTotals({
        key1: 0,
        key2: 2,
        key3: 2,
      });

      expect(result).toEqual(4);
    });

    it('handles string entries', () => {
      const result = getTotals({
        key1: '2',
        key2: '4',
        key3: '1',
      });

      expect(result).toEqual(7);
    });

    it('handles partial null entries', () => {
      const result = getTotals({
        key1: null,
        key2: 1,
        key3: 2,
      });

      expect(result).toEqual(3);
    });

    it('handles all null entries', () => {
      const result = getTotals({
        key1: null,
        key2: null,
        key3: null,
      });

      expect(result).toBeNull();
    });
  });
});
