import React, { useEffect, useRef, useState } from 'react';

import {
  Collapse,
  ImageList,
  ImageListItem,
  Link,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { DashBoardListItem } from 'landing/dashboard/dashboards-list-item.component';

import { BookmarksListItem } from './bookmarks-list-item/bookmarks-list-item.component';
import { MAX_VISIBLE_BOOKMARKS } from './landing-constants';

const useStyles = makeStyles(theme => ({
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  collapse: {
    width: '100%',
  },
  bookmarks: {
    overflowY: props => (props.viewAllItems ? 'auto' : 'hidden'),
    maxHeight: theme.typography.pxToRem(258 * 2.5),
  },

  bookmark: {
    display: 'flex',
    justifyContent: 'center',
  },
  dashboards: {
    overflowY: props => (props.viewAllItems ? 'auto' : 'hidden'),
    maxHeight: theme.typography.pxToRem(258 * 2.5),
  },

  dashboard: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

/**
 * @param {{
 *   bookmarks: import('typings').Bookmark[]
 *   chooseBookmark?: (bookmark: import('typings').Bookmark) => void
 * }} props
 */
export const ContentLanding = ({ bookmarks, dashboards, chooseBookmark }) => {
  const [viewAllItems, setViewAllItems] = useState(false);
  /** @type {React.Ref<HTMLUListElement>} */
  const gridRef = useRef();
  const styles = useStyles({ viewAllItems });

  const toggle = () => setViewAllItems(!viewAllItems);

  useEffect(() => {
    if (!viewAllItems && gridRef?.current?.scrollTo)
      gridRef.current.scrollTo(0, 0);
  }, [viewAllItems]);

  return (
    <>
      <div className={styles.controls}>
        <Typography variant="h2" color="textPrimary">
          {viewAllItems ? 'View All' : 'Your Maps'}
        </Typography>
        {bookmarks?.length > MAX_VISIBLE_BOOKMARKS && (
          <Link component="button" onClick={toggle}>
            {viewAllItems ? 'Hide all' : 'View all'}
          </Link>
        )}
      </div>
      <Collapse
        className={styles.collapse}
        collapsedSize={258}
        in={viewAllItems}
      >
        <ImageList
          ref={gridRef}
          className={styles.bookmarks}
          rowHeight="auto"
          cols={MAX_VISIBLE_BOOKMARKS}
          gap={4}
        >
          {bookmarks?.map(bookmark => (
            <ImageListItem key={bookmark.id} className={styles.bookmark}>
              <BookmarksListItem bookmark={bookmark} onClick={chooseBookmark} />
            </ImageListItem>
          ))}
        </ImageList>
        <ImageList
          ref={gridRef}
          className={styles.dashboards}
          rowHeight="auto"
          // cols={MAX_VISIBLE_BOOKMARKS}
          // gap={4}
        >
          {dashboards?.map(dashboard => (
            <ImageListItem key={dashboard.id} className={styles.dashboard}>
              <DashBoardListItem
                dashboard={dashboard}
                // onClick={chooseDashboard}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Collapse>
    </>
  );
};
