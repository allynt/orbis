import React, { useEffect, useRef, useState } from 'react';

import {
  Collapse,
  ImageList,
  ImageListItem,
  Link,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { ContentListItem } from './content-list-item/content-list-item.component';
import { MAX_VISIBLE_ITEMS, CONTENT_TYPES } from './landing-constants';

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
  content: {
    overflowY: props => (props.viewAllContent ? 'auto' : 'hidden'),
    maxHeight: theme.typography.pxToRem(258 * 2.5),
  },
  contentItem: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const ExpandableItemList = ({
  data,
  contentType,
  viewAllContent,
  gridRef,
  onClick,
  toggle,
}) => {
  const styles = useStyles({ viewAllContent });
  return (
    <>
      <div className={styles.controls}>
        <Typography variant="h2" color="textPrimary">
          {viewAllContent ? 'View All' : `Your ${contentType}`}
        </Typography>
        {data?.length > MAX_VISIBLE_ITEMS && (
          <Link component="button" onClick={() => toggle(contentType)}>
            {viewAllContent ? 'Hide all' : 'View all'}
          </Link>
        )}
      </div>
      <Collapse
        className={styles.collapse}
        collapsedSize={258}
        in={viewAllContent}
      >
        <ImageList
          ref={gridRef}
          className={styles.content}
          rowHeight="auto"
          cols={MAX_VISIBLE_ITEMS}
          gap={4}
        >
          {data?.map(item => {
            return (
              <ImageListItem
                key={item?.id ?? item?.source_id}
                className={styles.contentItem}
              >
                <ContentListItem item={item} onClick={onClick} />
              </ImageListItem>
            );
          })}
        </ImageList>
      </Collapse>
    </>
  );
};

/**
 * @param {{
 *   bookmarks: import('typings').Bookmark[]
 *   chooseBookmark?: (bookmark: import('typings').Bookmark) => void
 *   dashboards: object[]
 *   chooseDashboard?: (dashboard: import('typings').Source) => void
 * }} props
 */
export const ContentLanding = ({
  bookmarks,
  chooseBookmark,
  dashboards,
  chooseDashboard,
}) => {
  const [viewAllContent, setViewAllContent] = useState({
    [CONTENT_TYPES.maps]: false,
    [CONTENT_TYPES.dashboards]: false,
  });
  /** @type {React.Ref<HTMLUListElement>} */
  const gridRef = useRef();

  const toggle = type =>
    setViewAllContent({ ...viewAllContent, [type]: !viewAllContent[type] });

  useEffect(() => {
    if (!viewAllContent && gridRef?.current?.scrollTo)
      gridRef.current.scrollTo(0, 0);
  }, [viewAllContent]);

  return (
    <>
      {!!bookmarks?.length ? (
        <ExpandableItemList
          data={bookmarks}
          contentType={CONTENT_TYPES.maps}
          viewAllContent={viewAllContent[CONTENT_TYPES.maps]}
          gridRef={gridRef}
          onClick={chooseBookmark}
          toggle={toggle}
        />
      ) : null}
      {!!dashboards?.length ? (
        <ExpandableItemList
          data={dashboards}
          contentType={CONTENT_TYPES.dashboards}
          viewAllContent={viewAllContent[CONTENT_TYPES.dashboards]}
          gridRef={gridRef}
          onClick={chooseDashboard}
          toggle={toggle}
        />
      ) : null}
    </>
  );
};
