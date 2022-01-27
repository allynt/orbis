import React from 'react';

import { CogIcon } from '@astrosat/astrosat-ui';

import faker from '@faker-js/faker/locale/en_GB';

import { ImageListItem } from './image-list-item.component';

export default {
  title: 'Components/Image List/Image List Item',
  args: { value: 1 },
  argTypes: { onChange: { action: true } },
};

const Template = args => <ImageListItem {...args} />;

export const Nothing = Template.bind({});

export const Image = Template.bind({});
Image.args = {
  src: faker.image.image(),
  alt: 'Some Random Image alt text',
  text: 'Some Random Image',
};

export const Icon = Template.bind({});
Icon.args = {
  icon: <CogIcon />,
  text: 'Using an Icon',
};

export const Selected = Template.bind({});
Selected.args = {
  ...Icon.args,
  text: 'This is selected',
  selectedValue: 1,
};
