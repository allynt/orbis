import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { fetchBookmarks, addBookmark, selectBookmark } from '../bookmarks/bookmarks.actions';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import Select from '@astrosat/astrosat-ui/dist/forms/select';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import NewMapForm from './new-map-form.component';

import { ReactComponent as OrbisLogo } from '../orbis.svg';
import { ReactComponent as ProfileIcon } from '../toolbar/profile.svg';
import { ReactComponent as LandingImage } from './landing.svg';

import styles from './landing.module.css';

const ItemMenu = () => {
  const options = [<option>Edit</option>, <option>Delete</option>, <option>Duplicate</option>];

  return <Select classNames={[styles.itemSelect]} options={options} onChange={console.log('hello')} />;
};

const Items = ({ items, chooseItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState(false);
  const dummyDate = 'Created 27 Nov 2019';

  return (
    <div className={styles.items}>
      {items.map(item => {
        return (
          <div className={styles.item} key={item.title} onClick={chooseItem}>
            <div className={styles.image}>
              <picture>
                <img src={item.thumbnail} alt={item.title}></img>
              </picture>
            </div>

            <div className={styles.info}>
              {selectedItem === item ? (
                <ItemMenu />
              ) : (
                <div>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.creationDate}>{dummyDate}</p>
                </div>
              )}
              <div
                className={styles.ellipsis}
                onClick={() => {
                  setSelectedItem(selectedItem === item ? null : item);
                }}
              >
                ...
              </div>
            </div>
          </div>
        );
      })}
      <div
        onClick={() => {
          setNewItem(!newItem);
        }}
      >
        <div className={styles.createNew}>+</div>
        <div className={styles.new}>
          <h3>New</h3>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(state => state.bookmarks.bookmarks);

  const { isVisible, toggle } = useModal(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  const chooseBookmark = bookmark => dispatch(selectBookmark(bookmark));

  const [viewAllItems, setViewAllItems] = useState(false);

  return (
    <div style={{ height: '100%' }}>
      {bookmarks ? (
        <div className={styles.landing}>
          <div className={styles.banner}>
            <OrbisLogo className={styles.logo} />
            <ProfileIcon className={styles.profileIcon} />
          </div>

          <div className={styles.maps}>
            <div className={styles.header}>
              <h1>Your Maps</h1>
              <p onClick={() => setViewAllItems(!viewAllItems)}>view all</p>
            </div>
            <Items items={bookmarks} chooseItem={chooseBookmark} />
          </div>

          <div className={styles.stories}>
            <div className={styles.header}>
              <h1>Your Stories</h1>
              <p>view all</p>
            </div>
            <Items items={bookmarks} chooseItem={chooseBookmark} />
          </div>

          <div className={styles.buttonContainer}>
            <Button theme="tertiary" classNames={[styles.button]}>
              Browse Map
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.splash}>
          <div className={styles.header}>
            <OrbisLogo className={styles.logo} />
          </div>
          <div className={styles.content}>
            <div className={styles.journey}>
              <h1>OR3IS JOURNEY</h1>

              <p className={styles.journeyText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>

              <Button theme="primary" classNames={[styles.journeyButton]} onClick={toggle}>
                Create New
              </Button>
            </div>

            <div className={styles.journeyImage}>
              <LandingImage className={styles.landingImage} />
            </div>

            <Dialog isVisible={isVisible} title="Create New Map" close={toggle} ref={ref}>
              <NewMapForm />
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

Landing.propTypes = {};

export default Landing;
