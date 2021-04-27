import React from 'react';
import PopupStatusAndNote from './popup-status-and-note.component';

import { defaultNote, longBodyNote } from './popup-status-and-note.test';

export default {
  title: 'Components/Feature Detail/Popup Note',
  argTypes: { onNoteSave: { action: 'Save note' } },
};

const Template = args => (
  <div style={{ maxWidth: '10rem' }}>
    <PopupStatusAndNote {...args} />
  </div>
);

export const Default = Template.bind({});

export const Note = Template.bind({});
Note.args = {
  note: defaultNote,
};

export const TooMuchText = Template.bind({});
TooMuchText.args = {
  note: longBodyNote,
};
