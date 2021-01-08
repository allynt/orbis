import React from 'react';

import { Box, List, Typography } from '@astrosat/astrosat-ui';

import { BookmarksListItem } from './bookmarks-list-item/bookmarks-list-item.component';

/**
 * @param {{
 *   bookmarks?: import('typings/orbis').Bookmark[]
 *   onSelectBookmark: (bookmark: import('typings/orbis').Bookmark) => void
 *   onDeleteBookmark: (bookmark: import('typings/orbis').Bookmark) => void
 * }} props
 */
const BookmarkList = ({ bookmarks, onSelectBookmark, onDeleteBookmark }) => (
  <>
    <Typography variant="h3" component="p" gutterBottom>
      Select an Existing Map
    </Typography>
    {bookmarks?.length > 0 ? (
      <List>
        {bookmarks.map(bookmark => (
          <BookmarksListItem
            key={bookmark.id}
            bookmark={bookmark}
            onSelect={onSelectBookmark}
            onDelete={onDeleteBookmark}
          />
        ))}
      </List>
    ) : (
      <Box component={List} display="flex" justifyContent="center">
        <Typography variant="h3" component="li">
          No Saved Maps
        </Typography>
      </Box>
    )}
  </>
);

export default BookmarkList;
