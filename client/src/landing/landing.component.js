import React, { useRef, useEffect, useState, forwardRef } from 'react';

import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchBookmarks, selectBookmark } from '../bookmarks/bookmarks.actions';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import Select from '@astrosat/astrosat-ui/dist/forms/select';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import NewMapForm from './new-map-form.component';

import { ReactComponent as OrbisLogo } from '../orbis-cropped.svg';
import { ReactComponent as ProfileIcon } from '../toolbar/profile.svg';
import { ReactComponent as OptionsIcon } from '../options-icon.svg';
import { ReactComponent as LandingImage } from './landing.svg';

import styles from './landing.module.css';
import '../bookmarks/bookmarks-panel.module.css';

const ItemMenu = () => {
  const options = [<option>Edit</option>, <option>Delete</option>, <option>Duplicate</option>];
  return <Select classNames={[styles.itemSelect]} options={options} onChange={console.log('hello')} />;
};

const ViewAllItems = ({ title, items, chooseBookmark, toggle, selectedItem, setSelectedItem, setViewAllItems }) => {
  return (
    <div>
      <div className={styles.header}>
        <h1>{title}</h1>
        <Button
          theme='link'
          classNames={[styles.headerButton]}
          onClick={() => {
            setViewAllItems(false);
          }}
        >
          Back to menu
        </ Button>
      </div>
      <Items
        classname='viewAllItems'
        items={items}
        chooseItem={chooseBookmark}
        toggle={toggle}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
};

const Items = ({ classname, items, chooseItem, toggle, selectedItem, setSelectedItem }) => {
  const [item, setItem] = useState(null);
  const dummyDate = 'Created 27 Nov 2019';

  if (item) {
    chooseItem(item);

    const viewport = { center: item.center, zoom: item.zoom };
    const queryString = encodeURI(JSON.stringify(viewport));
    return <Redirect to={`/map/${queryString}`} />;
  }
  return (
    <div className={styles[classname]}>
      {items.map(item => {
        return (
          <div className={styles.item} key={item.title}>
            <div className={styles.image} onClick={() => setItem(item)}>
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
                className={styles.optionsIcon}
                onClick={() => {
                  setSelectedItem(selectedItem === item ? null : item);
                }}
              >
                <OptionsIcon />
              </div>
            </div>
          </div>
        );
      })}

      <div onClick={toggle}>
        <div className={styles.createNew}>+</div>
      </div>
    </div>
  );
};

const NewUserLanding = forwardRef(({ toggle, isVisible }, ref) => {
  return (
    <div className={styles.splash} ref={ref}>
      <div className={styles.header}>
        <OrbisLogo className={styles.logo} />
      </div>
      <div className={styles.content}>
        <div className={styles.journey}>
          <h1>OR3IS JOURNEY</h1>

          <p className={styles.journeyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
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
  );
});

const ExistingUserLanding = forwardRef(({ bookmarks, chooseBookmark, isVisible, toggle }, ref) => {

  const mostRecentItems = bookmarks.slice(0, 4);
  const [viewAllItems, setViewAllItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [title, setTitle] = useState('');
  const [redirect, setRedirect] = useState('');

  return (
    <div className={styles.landing} ref={ref}>

      <div className={styles.banner}>
        <OrbisLogo className={styles.logo} />
        <ProfileIcon className={styles.profileIcon} />
      </div>

      {viewAllItems ? (
        <ViewAllItems
          title={title}
          items={bookmarks}
          chooseBookmark={chooseBookmark}
          toggle={toggle}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setViewAllItems={setViewAllItems}
        />
      ) : (
        <div className={styles.itemRows}>
          <div className={styles.header}>
            <h1>Your Maps</h1>
            <Button
              id="Your Maps"
              theme='link'
              classNames={[styles.headerButton]}
              onClick={evt => {
                setTitle(evt.target.id);
                setViewAllItems(true);
              }}
            >
              View all
            </ Button>
          </div>
          <Items
            classname='items'
            items={mostRecentItems}
            chooseItem={chooseBookmark}
            toggle={toggle}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />

          <div className={styles.header}>
            <h1>Your Stories</h1>
            <Button
              id="Your Stories"
              theme='link'
              classNames={[styles.headerButton]}
              onClick={evt => {
                setTitle(evt.target.id);
                setViewAllItems(true);
              }}
            >
              View all
            </ Button>
          </div>
          <Items
            classname='items'
            items={mostRecentItems}
            chooseItem={chooseBookmark}
            toggle={toggle}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
      )}

      {redirect && <Redirect to={redirect}/>}

      <div className={styles.buttonContainer}>
        <Button theme="tertiary" classNames={[styles.button]} onClick={()=>setRedirect('/map')}>
          Browse Map
        </Button>
      </div>

      <Dialog isVisible={isVisible} title="Create New Map" close={toggle} ref={ref}>
        <NewMapForm />
      </Dialog>
    </div>
  );
});

const Landing = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(state => state.bookmarks.bookmarks);
  // const bookmarks = null;
  const { isVisible, toggle } = useModal(false);
  const ref = useRef(null);

  const chooseBookmark = bookmark => {
    dispatch(selectBookmark(bookmark));
  };

  useEffect(() => {
    if (!bookmarks) {
      dispatch(fetchBookmarks());
    }
  }, [bookmarks, dispatch]);

  return (
    <div style={{ height: '100%' }}>
      {bookmarks ? (
        <ExistingUserLanding
          bookmarks={bookmarks}
          chooseBookmark={chooseBookmark}
          toggle={toggle}
          isVisible={isVisible}
          ref={ref}
        />
      ) : (
        <NewUserLanding
          toggle={toggle}
          isVisible={isVisible}
          ref={ref}
        />
      )}
    </div>
  );
};

Landing.propTypes = {};

export default Landing;
