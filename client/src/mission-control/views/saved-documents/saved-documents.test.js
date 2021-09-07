import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';

import SavedDocuments from './saved-documents.component';

const TEST_DOCUMENTS = new Array(20).fill().map((_, i) => ({
  id: `${i}`,
  name: `job-title-${i}`,
  timestamp: new Date(2020, 0, i).toISOString(),
  file: `url-${i}`,
}));

const renderComponent = () => {
  const utils = render(<SavedDocuments documents={TEST_DOCUMENTS} />);
  return { ...utils };
};

describe('<Saved Documents />', () => {
  it('renders a saved documents table', () => {
    const { getByText } = renderComponent();

    userEvent.click(getByText('5'));
    userEvent.click(getByText('20'));

    TEST_DOCUMENTS.forEach(({ name, timestamp }) => {
      const displayDate = format(new Date(timestamp), 'dd-MM-yyyy');
      expect(getByText(name)).toBeInTheDocument();
      expect(getByText(displayDate)).toBeInTheDocument();
    });
  });
});
