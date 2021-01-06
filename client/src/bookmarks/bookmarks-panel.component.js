import { userSelector } from 'accounts/accounts.selectors';
import { activeLayersSelector } from 'data-layers/data-layers.slice';
import { useMap } from 'MapContext';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookmarkForm from './bookmark-form/bookmark-form.component';
import {
  addBookmark,
  deleteBookmark,
  fetchBookmarks,
  selectBookmark,
} from './bookmarks.slice';
import BookmarkList from './bookmarks-list/bookmarks-list.component';
import { Box, Divider, styled } from '@astrosat/astrosat-ui';

const PrimaryDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const BookmarksPanel = () => {
  const { createScreenshot, viewState } = useMap();
  const layers = useSelector(activeLayersSelector);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

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

  const bookmarks = useSelector(state => state?.bookmarks?.bookmarks);

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

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
          selectBookmark={bookmark => dispatch(selectBookmark(bookmark))}
          deleteBookmark={bookmark => dispatch(deleteBookmark(bookmark))}
        />
      </Box>
    </>
  );
};

export default BookmarksPanel;
