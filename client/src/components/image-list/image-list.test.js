import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImageListItem } from './image-list-item/image-list-item.component';
import { ImageList } from './image-list.component';

const renderComponent = value => {
  const onChange = jest.fn();
  const utils = render(
    <ImageList onChange={onChange} value={value} name="test-group">
      <ImageListItem value="one" text="One" />
      <ImageListItem value="two" text="Two" />
    </ImageList>,
  );
  return { ...utils, onChange };
};

describe('<ImageList />', () => {
  it('Calls onChange with the clicked value', () => {
    const { getByRole, onChange } = renderComponent();
    userEvent.click(getByRole('radio', { name: 'Two' }), undefined, {
      skipPointerEventsCheck: true,
    });
    expect(onChange).toBeCalledWith('two');
  });

  it('Shows the correct item as checked', () => {
    const { getByRole } = renderComponent('one');
    expect(getByRole('radio', { name: 'One' })).toBeChecked();
  });
});
