import { CogIcon, EyeIcon, PinIcon } from '@astrosat/astrosat-ui';
import faker from 'faker/locale/en_GB';
import React from 'react';
import { ImageListItem } from './image-list-item/image-list-item.component';
import { ImageList } from './image-list.component';

export default {
  title: 'Components/Image List',
  argTypes: { onChange: { action: true } },
};

export const WithImages = args => (
  <ImageList {...args} name="test-group">
    {Array(10)
      .fill(undefined)
      .map(() => (
        <ImageListItem
          key={faker.random.uuid()}
          src={faker.image.animals()}
          text={faker.commerce.productName()}
          value={faker.commerce.productName()}
        />
      ))}
  </ImageList>
);

const icons = [
  <CogIcon color="primary" />,
  <EyeIcon color="primary" />,
  <PinIcon color="primary" />,
];

export const WithIcons = args => (
  <ImageList {...args} name="test-group">
    {Array(10)
      .fill(undefined)
      .map(() => (
        <ImageListItem
          key={faker.random.uuid()}
          icon={faker.random.arrayElement(icons)}
          text={faker.commerce.productName()}
          value={faker.commerce.productName()}
        />
      ))}
  </ImageList>
);
