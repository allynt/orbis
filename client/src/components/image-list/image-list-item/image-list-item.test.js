import React from 'react';

import { CloseIcon } from '@astrosat/astrosat-ui';

import faker from '@faker-js/faker/locale/en_GB';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImageListItem } from './image-list-item.component';

describe('<ImageListItem />', () => {
  it('Shows an image if an image is provided', () => {
    const { getByRole } = render(
      <ImageListItem src={faker.image.image()} alt="test image" />,
    );
    expect(getByRole('img', { name: 'test image' })).toBeInTheDocument();
  });

  it('Shows an icon if an icon is provided', () => {
    const { getByTestId } = render(
      <ImageListItem
        icon={<CloseIcon data-testid="svg" titleAccess="close" />}
      />,
    );
    expect(getByTestId('svg')).toBeInTheDocument();
  });

  it('Calls onChange when clicked', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <ImageListItem text="test item" value="test" onChange={onChange} />,
    );
    userEvent.click(getByRole('radio', { name: 'test item' }), undefined, {
      skipPointerEventsCheck: true,
    });
    expect(onChange).toBeCalledWith('test');
  });
});
