import React from 'react';

import { render, screen, userEvent, within } from 'test/test-utils';
import { formatDate } from 'utils/dates';

import TimeLineList from './timeline-list.component';

const emptySelectedFeature = {
  'Application ID': 220655,
  data: [],
};

const nonExpandableSelectedFeature = {
  'Application ID': 220655,
  data: [
    {
      'Application ID': 220655,
      Type: 'Planning',
      Date: null,
      Description: 'Planning permission granted',
      Source: 'Tascomi',
      'Date Type': 'Approved on',
      additional_fields: {},
    },
    {
      'Application ID': 220655,
      Type: 'Building Control',
      Description: 'Completion Certificate Issued',
      Date: '2022-02-14T00:00:00.000Z',
      Source: 'Tascomi - BC',
      'Date Type': 'Certificate Issued',
      additional_fields: {},
    },
  ],
};

const mixedSelectedFeature = {
  'Application ID': 220655,
  data: [
    {
      'Application ID': 220655,
      Type: 'Planning',
      Date: null,
      Description: 'Planning permission granted',
      Source: 'Tascomi',
      'Date Type': 'Approved on',
      additional_fields: {},
    },
    {
      'Application ID': 220655,
      Type: 'Building Control',
      Description: 'Completion Certificate Issued',
      Date: '2022-02-14T00:00:00.000Z',
      Source: 'Tascomi - BC',
      'Date Type': 'Certificate Issued',
      additional_fields: {
        'Detailed description':
          'Loft conversion, single storey extension, removal of chimney breast and installation of windows and door',
        'BC Application ID': 3311678,
        'Matched on': 'UPRN',
        'Match confidence': 'High',
      },
    },
  ],
};

describe('TimeLine List Component', () => {
  it('should render headings and titles', () => {
    render(<TimeLineList selectedFeature={emptySelectedFeature} />);

    expect(
      screen.getByText('Planning Application Reference Number:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(emptySelectedFeature['Application ID']),
    ).toBeInTheDocument();
  });

  it('should render an empty list', () => {
    render(<TimeLineList selectedFeature={emptySelectedFeature} />);

    expect(
      screen.getByRole('heading', { name: /no timeline data/i }),
    ).toBeInTheDocument();
  });

  it('should render a non-expandable populated list', () => {
    render(<TimeLineList selectedFeature={nonExpandableSelectedFeature} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    const data = [
      {
        title: `${nonExpandableSelectedFeature.data[0].Type} - ${nonExpandableSelectedFeature.data[0].Description}`,
        dateLabel: `${nonExpandableSelectedFeature.data[0]['Date Type']}:`,
        date: 'No date available',
        sourceLabel: 'Source:',
        source: nonExpandableSelectedFeature.data[0].Source,
      },
      {
        title: `${nonExpandableSelectedFeature.data[1].Type} - ${nonExpandableSelectedFeature.data[1].Description}`,
        dateLabel: `${nonExpandableSelectedFeature.data[1]['Date Type']}:`,
        date: formatDate(new Date(nonExpandableSelectedFeature.data[1].Date)),
        sourceLabel: 'Source:',
        source: nonExpandableSelectedFeature.data[1].Source,
      },
    ];
    listItems.forEach((listItem, i) => {
      expect(
        within(listItem).getByRole('heading', { name: data[i].title }),
      ).toBeInTheDocument();
      expect(within(listItem).getByText(data[i].dateLabel)).toBeInTheDocument();
      expect(within(listItem).getByText(data[i].date)).toBeInTheDocument();
      expect(
        within(listItem).getByText(data[i].sourceLabel),
      ).toBeInTheDocument();
      expect(within(listItem).getByText(data[i].source)).toBeInTheDocument();

      expect(
        within(listItem).queryByRole('closedsection'),
      ).not.toBeInTheDocument();
      expect(
        within(listItem).queryByRole('opensection'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render a mixture of expandable and non-expandable populated list', () => {
    render(<TimeLineList selectedFeature={mixedSelectedFeature} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    const data = [
      {
        title: `${mixedSelectedFeature.data[0].Type} - ${mixedSelectedFeature.data[0].Description}`,
        dateLabel: `${mixedSelectedFeature.data[0]['Date Type']}:`,
        date: 'No date available',
        sourceLabel: 'Source:',
        source: mixedSelectedFeature.data[0].Source,
      },
      {
        title: `${mixedSelectedFeature.data[1].Type} - ${mixedSelectedFeature.data[1].Description}`,
        dateLabel: `${mixedSelectedFeature.data[1]['Date Type']}:`,
        date: formatDate(new Date(mixedSelectedFeature.data[1].Date)),
        sourceLabel: 'Source:',
        source: mixedSelectedFeature.data[1].Source,
      },
    ];
    listItems.forEach((listItem, i) => {
      expect(
        within(listItem).getByRole('heading', { name: data[i].title }),
      ).toBeInTheDocument();
      expect(within(listItem).getByText(data[i].dateLabel)).toBeInTheDocument();
      expect(within(listItem).getByText(data[i].date)).toBeInTheDocument();
      expect(
        within(listItem).getByText(data[i].sourceLabel),
      ).toBeInTheDocument();
      expect(within(listItem).getByText(data[i].source)).toBeInTheDocument();

      // Only the second item should be expandable.
      if (i === 1) {
        expect(within(listItem).getByRole('closedsection')).toBeInTheDocument();
      }
      expect(
        within(listItem).queryByRole('opensection'),
      ).not.toBeInTheDocument();
    });
  });

  it('should expand a list', () => {
    render(<TimeLineList selectedFeature={mixedSelectedFeature} />);

    userEvent.click(screen.getByRole('closedsection'));

    expect(screen.getByRole('opensection')).toBeInTheDocument();
    expect(screen.getByText('Detailed description:')).toBeInTheDocument();
    expect(screen.getByText('BC Application ID:')).toBeInTheDocument();
    expect(screen.getByText('Matched on:')).toBeInTheDocument();
    expect(screen.getByText('Match confidence:')).toBeInTheDocument();
  });
});
