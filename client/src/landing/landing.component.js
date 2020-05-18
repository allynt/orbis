import React, { useRef, useEffect, useState, forwardRef } from 'react';

import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { format } from 'date-fns';

import { setViewport } from '../map/map.slice';
import { regions } from '../map/map.constants';
import { selectDomainList } from '../data-layers/data-layers.slice';
import { fetchBookmarks, selectBookmark } from '../bookmarks/bookmark.slice';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import NewMapForm from './new-map-form.component';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import styles from './landing.module.css';

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
          const date = format(new Date(item.created), ['MMMM do Y']);
          const dateString = `Created ${date}`;

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
                  <p className={styles.creationDate}>{dateString}</p>
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

const NewUserLanding = ({ setRedirect }) => (
  <div className={styles.splash}>
    <div className={styles.splashHeader}>
      <OrbisLogo className={styles.logo} />
    </div>

    <div className={styles.splashContent}>
      <div className={styles.journey}>
        <h1>ORBIS JOURNEY</h1>

        <div className={styles.journeyText}>
          <p>Your Earth Observation journey starts here</p>
          <p>Click Browse Map below to start</p>
        </div>

        <div>
          <Button theme="tertiary" onClick={() => setRedirect('/map')} data-testid="browse-map">
            Browse Map
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const ExistingUserLanding = forwardRef(
  ({ bookmarks, chooseBookmark, setRedirect, isVisible, toggle, regions, domains, setViewport }, ref) => {
    const recentItems = bookmarks.slice(0, 4);
    const [viewAllItems, setViewAllItems] = useState(false);

    return (
      <div className={styles.landingContent} ref={ref}>
        <div className={styles.banner}>
          <OrbisLogo className={styles.logo} />
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
            <Items items={recentItems} chooseItem={chooseBookmark} toggle={toggle} />
          </div>
        )}

        <div className={styles.buttonContainer}>
          <Button theme="tertiary" onClick={() => setRedirect('/map')}>
            Browse Map
          </Button>
        </div>

        <Dialog isVisible={isVisible} title="Create New Map" close={toggle} ref={ref}>
          <NewMapForm regions={regions} domains={domains} setViewport={setViewport} />
        </Dialog>
      </div>
    );
  },
);

const Landing = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(state => state.bookmarks.bookmarks);
  const [isVisible, toggle] = useModal(false);
  const [redirect, setRedirect] = useState(null);
  const ref = useRef(null);

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));
  const domains = useSelector(selectDomainList);
  const updateViewport = region => dispatch(setViewport(region));

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className={styles.landing}>
      {bookmarks && bookmarks.length > 0 ? (
        <ExistingUserLanding
          bookmarks={bookmarks}
          chooseBookmark={chooseBookmark}
          setRedirect={setRedirect}
          toggle={toggle}
          isVisible={isVisible}
          regions={regions}
          domains={domains}
          setViewport={updateViewport}
          ref={ref}
        />
      ) : (
        <NewUserLanding setRedirect={setRedirect} />
      )}
    </div>
  );
};

Landing.propTypes = {};

export default Landing;
