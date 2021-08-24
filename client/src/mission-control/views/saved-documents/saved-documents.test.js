import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker/locale/en_GB';

import SavedDocuments from './saved-documents.component';

const TEST_DOCUMENTS = new Array(20).fill().map(() => ({
  id: faker.random.uuid(),
  title: faker.name.jobTitle(),
  date: faker.date.past().toISOString(),
  url: faker.image.imageUrl(),
}));

const renderComponent = () => {
  const utils = render(<SavedDocuments documents={TEST_DOCUMENTS} />);
  return { ...utils };
};

describe('<Saved Documents />', () => {
  it('renders a saved documents table', () => {
    const { getByText } = renderComponent({});

    userEvent.click(getByText('5'));
    userEvent.click(getByText('20'));

    TEST_DOCUMENTS.forEach(doc => {
      expect(getByText(doc.title)).toBeInTheDocument();
    });
  });
});
