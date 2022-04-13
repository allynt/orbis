import React from 'react';

import { render, screen, userEvent } from 'test/test-utils';

import { RESULTS } from '../../mock-data/NatureScot/assessment-results';
import ProtectedAreasList from './protected-areas-list.component';

describe('Protected Areas List', () => {
  it('should display an empty expandable list', () => {
    render(<ProtectedAreasList areas={[]} />);

    expect(
      screen.getByRole('heading', { name: /protected areas/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
  });

  it('should display 2 expandable lists', () => {
    render(<ProtectedAreasList areas={RESULTS.areas} />);

    expect(
      screen.getByRole('button', {
        name: 'SSSI 1186 Moorfoot Hills View on SiteLink (This protected area is within your Area of Interest)',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', { name: /view on sitelink/i }).length,
    ).toBe(2);

    expect(
      screen.getByRole('button', {
        name: 'SAC Moorfoot Hills View on SiteLink (This protected area overlaps with your Area of Interest)',
      }),
    ).toBeInTheDocument();
  });

  it('should expand feature', () => {
    render(<ProtectedAreasList areas={RESULTS.areas} />);

    userEvent.click(
      screen.getByRole('button', {
        name: 'SAC Moorfoot Hills View on SiteLink (This protected area overlaps with your Area of Interest)',
      }),
    );

    const subSection = screen.getByText('Qualifying Interests');
    expect(subSection).toBeInTheDocument();

    userEvent.click(subSection);

    expect(
      screen.getByRole('button', {
        name: 'Qualifying Interests Any activity which has an impact on these interests may require a European Habitats Regulations Assessment to be carried out. Causing any damage to these qualifying interests may be a criminal offence. These features are protected by this designation Blanket bogs (Blanket bog) European dry heaths (Dry heaths)',
      }),
    ).toBeInTheDocument();
  });
});
