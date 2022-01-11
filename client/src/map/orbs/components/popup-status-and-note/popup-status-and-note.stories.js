import React from 'react';

import PopupStatusAndNote from './popup-status-and-note.component';
import { defaultNote, longBodyNote } from './popup-status-and-note.test';

const Index = {
  title: 'Components/Feature Detail/Popup Note and Status',
  argTypes: { onSave: { action: 'Save note and/or Status' } },
};

export default Index;

const Template = args => (
  <div style={{ maxWidth: '10rem' }}>
    <PopupStatusAndNote {...args} />
  </div>
);

export const Default = Template.bind({});

export const NoteAndStatus = Template.bind({});
NoteAndStatus.args = {
  id: 123,
  status: 'NEW',
  note: defaultNote,
};

export const TooMuchText = Template.bind({});
TooMuchText.args = {
  id: 456,
  status: 'NEW',
  note: longBodyNote,
};

export const NoData = Template.bind({});
NoData.args = {
  id: 789,
  status: null,
  notes: null,
};
