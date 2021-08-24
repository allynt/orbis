import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';

import SavedDocuments from './saved-documents.component';

const TEST_DOCUMENTS = new Array(20).fill().map((_, i) => ({
  id: `${i}`,
  title: `job-title-${i}`,
  date: new Date(2020, 0, i).toISOString(),
  url: `url-${i}`,
}));

const renderComponent = () => {
  const utils = render(<SavedDocuments documents={TEST_DOCUMENTS} />);
  return { ...utils };
};

describe.skip('<Saved Documents />', () => {
  it('renders a saved documents table', () => {
    const { getByText } = renderComponent({});

    userEvent.click(getByText('5'));
    userEvent.click(getByText('20'));

    TEST_DOCUMENTS.forEach(({ title, date }) => {
      const displayDate = format(new Date(date), 'dd-MM-yyyy');
      expect(getByText(title)).toBeInTheDocument();
      expect(getByText(displayDate)).toBeInTheDocument();
    });
  });
});
