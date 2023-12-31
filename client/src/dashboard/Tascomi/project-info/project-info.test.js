import React from 'react';

import { render, screen } from 'test/test-utils';

import ProjectInfo from './project-info.component';

describe('ProjectInfo', () => {
  it('renders', () => {
    render(<ProjectInfo selectedFeature={{}} />);

    const headers = [
      'Reference Numbers',
      'Location',
      'Site Details',
      'Dates',
      'CIL',
      'S106',
    ];

    headers.forEach(header =>
      expect(screen.getByRole('heading', { name: header })).toBeInTheDocument(),
    );
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

  it('formats dates', () => {
    const selectedFeature = {
      'Registered date': '2022-05-31T15:42:20.722Z',
    };

    render(<ProjectInfo selectedFeature={selectedFeature} />);

    expect(screen.getByText('31/05/2022')).toBeInTheDocument();
  });
});
