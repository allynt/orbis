import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Divider, styled } from '@astrosat/astrosat-ui';

import { userSelector } from 'accounts/accounts.selectors';
import { activeLayersSelector } from 'data-layers/data-layers.slice';
import { useMap } from 'MapContext';
import BookmarkForm from './bookmark-form/bookmark-form.component';
import BookmarkList from './bookmarks-list/bookmarks-list.component';
import {
  addBookmark,
  bookmarksSelector,
  deleteBookmark,
  fetchBookmarks,
  selectBookmark,
} from './bookmarks.slice';

const PrimaryDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const BookmarksPanel = () => {
  const { createScreenshot, viewState } = useMap();
  const dispatch = useDispatch();
  const layers = useSelector(activeLayersSelector);
  const user = useSelector(userSelector);
  const bookmarks = useSelector(bookmarksSelector);

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  const submit = form => {
    createScreenshot(thumbnail => {
      dispatch(
        addBookmark({
          ...form,
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          owner: user.id,
          thumbnail,
          layers,
        }),
      );
    });
  };

  return (
    <>
      <Box py={3} px={1}>
        <BookmarkForm
          bookmarkTitles={bookmarks?.map(b => b?.title?.toLowerCase())}
          onSubmit={submit}
        />
      </Box>
      <PrimaryDivider />
      <Box py={3} px={1}>
        <BookmarkList
          bookmarks={bookmarks}
          onSelectBookmark={bookmark => dispatch(selectBookmark(bookmark))}
          onDeleteBookmark={bookmark => dispatch(deleteBookmark(bookmark))}
        />
      </Box>
    </>
  );
};

export default BookmarksPanel;
