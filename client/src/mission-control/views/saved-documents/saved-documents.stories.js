import React from 'react';

import faker from 'faker/locale/en_GB';

import SavedDocuments from './saved-documents.component';

const TEST_DOCUMENTS = new Array(20).fill().map(() => ({
  id: faker.random.uuid(),
  title: faker.name.jobTitle(),
  date: faker.date.past().toISOString(),
  url: faker.image.imageUrl(),
}));

export default { title: 'Mission Control/Saved Documents' };

const Template = args => <SavedDocuments {...args} />;

export const Default = Template.bind({});
Default.args = {
  documents: TEST_DOCUMENTS,
};
