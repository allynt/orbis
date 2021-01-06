import React, { useEffect, useState } from 'react';

import { Redirect, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { format } from 'date-fns';

import { DATE_FORMAT, MAX_VISIBLE_BOOKMARKS } from './landing-constants';

import {
  baseSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmark.slice';

import { Button } from '@astrosat/astrosat-ui';

import { ReactComponent as OrbisLogoLight } from '../orbis-light.svg';
import { ReactComponent as OrbisLogoDark } from '../orbis-dark.svg';

import styles from './landing.module.css';

const ViewAllItems = ({ items, chooseBookmark, toggle }) => (
  <div className={styles.content}>
    <div className={styles.header}>
      <h1>View All</h1>
      <Button theme="link" onClick={toggle}>
        Back to menu
      </Button>
    </div>
    <Items items={items} chooseItem={chooseBookmark} />
  </div>
);

const Items = ({ items, chooseItem }) => {
  const [item, setItem] = useState(null);

  if (item) {
    chooseItem(item);

    const viewport = { center: item.center, zoom: item.zoom };
    const queryString = encodeURI(JSON.stringify(viewport));
    return <Redirect to={`/map/${queryString}`} />;
  }
  return (
    <div className={styles.items}>
      {items.map(item => {
        const date = format(new Date(item.created), DATE_FORMAT);

        return (
          <div className={styles.item} key={item.title}>
            <div className={styles.image} onClick={() => setItem(item)}>
              <picture>
                <img src={item.thumbnail} alt={item.title}></img>
              </picture>
            </div>
            <div className={styles.info}>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.creationDate}>{`Created ${date}`}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const NewUserLanding = () => (
  <div className={styles.splash}>
    <div className={styles.splashHeader}>
      <OrbisLogoLight className={styles.logo} />
    </div>

    <div className={styles.splashContent}>
      <div className={styles.journey}>
        <h1>ORBIS JOURNEY</h1>

        <div className={styles.journeyText}>
          <p>Your Earth Observation journey starts here</p>
          <p>Click Browse Map below to start</p>
        </div>

        <Link to="/map">
          <Button theme="tertiary" data-testid="browse-map">
            Browse Map
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

const ExistingUserLanding = ({ bookmarks, chooseBookmark }) => {
  const recentItems = bookmarks.slice(0, MAX_VISIBLE_BOOKMARKS);
  const [viewAllItems, setViewAllItems] = useState(false);

  const toggle = () => setViewAllItems(!viewAllItems);

  return (
    <div className={styles.landingContent}>
      <div className={styles.banner}>
        <OrbisLogoDark className={styles.logo} />
      </div>

      {viewAllItems ? (
        <ViewAllItems
          items={bookmarks}
          chooseBookmark={chooseBookmark}
          toggle={toggle}
        />
      ) : (
        <div className={styles.content}>
          <div className={styles.header}>
            <h1>Your Maps</h1>
            {bookmarks.length > MAX_VISIBLE_BOOKMARKS && (
              <Button theme="link" onClick={toggle}>
                View all
              </Button>
            )}
          </div>
          <Items items={recentItems} chooseItem={chooseBookmark} />
        </div>
      )}

      <div className={styles.buttonContainer}>
        <Link to="/map">
          <Button theme="tertiary">Browse Map</Button>
        </Link>
      </div>
    </div>
  );
};

const Landing = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(baseSelector)?.bookmarks;

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <div className={styles.landing}>
      {bookmarks?.length > 0 ? (
        <ExistingUserLanding
          bookmarks={bookmarks}
          chooseBookmark={chooseBookmark}
        />
      ) : (
        <NewUserLanding />
      )}
    </div>
  );
};

Landing.propTypes = {};

export default Landing;
