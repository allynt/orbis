import React from 'react';

import { Box, List, Typography } from '@astrosat/astrosat-ui';

import { BookmarksListItem } from './bookmarks-list-item/bookmarks-list-item.component';

const BookmarkList = ({ bookmarks, selectBookmark, deleteBookmark }) =>
  bookmarks?.length > 0 ? (
    <List>
      {bookmarks.map(bookmark => (
        <BookmarksListItem
          key={bookmark.id}
          bookmark={bookmark}
          onSelect={selectBookmark}
          onDelete={deleteBookmark}
        />
      ))}
    </List>
  ) : (
    <Box component={List} display="flex" justifyContent="center">
      <Typography variant="h3" component="li">
        No Saved Maps
      </Typography>
    </Box>
  );

export default BookmarkList;
