import * as React from 'react';
import BookmarkList from './bookmarks-list.component';

export default { title: 'Bookmarks/Bookmarks List' };

const Template = args => <BookmarkList {...args} />;

export const NoBookmarks = Template.bind({});
