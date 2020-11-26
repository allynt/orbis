import React, { useRef, useEffect, useState, forwardRef } from 'react';

import { Redirect, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { format } from 'date-fns';

import { regions } from '../map/map.constants';
import { selectDomainList } from '../data-layers/data-layers.slice';
import {
  baseSelector,
  fetchBookmarks,
  selectBookmark,
} from '../bookmarks/bookmark.slice';

import { Button, Dialog, useModal } from '@astrosat/astrosat-ui';

import NewMapForm from './new-map-form.component';

import { ReactComponent as OrbisLogoLight } from '../orbis-light.svg';
import { ReactComponent as OrbisLogoDark } from '../orbis-dark.svg';

import styles from './landing.module.css';

const DATE_FORMAT = ['MMMM do Y'];

const ViewAllItems = ({ items, chooseBookmark, toggle, setViewAllItems }) => (
  <div className={styles.content}>
    <div className={styles.header}>
      <h1>View All</h1>
      <Button theme="link" onClick={() => setViewAllItems(false)}>
        Back to menu
      </Button>
    </div>
    <Items items={items} chooseItem={chooseBookmark} toggle={toggle} />
  </div>
);

const Items = ({ items, chooseItem, toggle }) => {
  const [item, setItem] = useState(null);

  if (item) {
    chooseItem(item);

    const viewport = { center: item.center, zoom: item.zoom };
    const queryString = encodeURI(JSON.stringify(viewport));
    return <Redirect to={`/map/${queryString}`} />;
  }
  return (
    <div className={styles.itemLayout}>
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
      <div onClick={toggle}>
        <div className={styles.createNew}>+</div>
      </div>
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

        <div>
          <Link to="/map">
            <Button theme="tertiary" data-testid="browse-map">
              Browse Map
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const ExistingUserLanding = forwardRef(
  ({ bookmarks, chooseBookmark, isVisible, toggle, regions, domains }, ref) => {
    const recentItems = bookmarks.slice(0, 4);
    const [viewAllItems, setViewAllItems] = useState(false);

    return (
      <div className={styles.landingContent} ref={ref}>
        <div className={styles.banner}>
          <OrbisLogoDark className={styles.logo} />
        </div>

        {viewAllItems ? (
          <ViewAllItems
            items={bookmarks}
            chooseBookmark={chooseBookmark}
            toggle={toggle}
            setViewAllItems={setViewAllItems}
          />
        ) : (
          <div className={styles.content}>
            <div className={styles.header}>
              <h1>Your Maps</h1>
              <Button theme="link" onClick={() => setViewAllItems(true)}>
                View all
              </Button>
            </div>
            <Items
              items={recentItems}
              chooseItem={chooseBookmark}
              toggle={toggle}
            />
          </div>
        )}

        <div className={styles.buttonContainer}>
          <Link to="/map">
            <Button theme="tertiary">Browse Map</Button>
          </Link>
        </div>

        <Dialog
          isVisible={isVisible}
          title="Create New Map"
          close={toggle}
          ref={ref}
        >
          <NewMapForm
            regions={regions}
            domains={domains}
            bookmarkTitles={bookmarks.map(b => b.title.toLowerCase())}
          />
        </Dialog>
      </div>
    );
  },
);

const Landing = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(baseSelector)?.bookmarks;
  const [isVisible, toggle] = useModal(false);
  const ref = useRef(null);

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));
  const domains = useSelector(selectDomainList);

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
          toggle={toggle}
          isVisible={isVisible}
          regions={regions}
          domains={domains}
          ref={ref}
        />
      ) : (
        <NewUserLanding />
      )}
    </div>
  );
};

Landing.propTypes = {};

export default Landing;
