import * as React from 'react';

import BookmarkForm from './bookmark-form.component';

export default { title: 'Bookmarks/Bookmarks Form' };

const Template = args => <BookmarkForm {...args} />;

export const Default = Template.bind({});
