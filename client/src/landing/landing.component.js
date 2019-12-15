import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import NewMapForm from './new-map-form.component';

import { ReactComponent as OrbisLogo } from '../orbis.svg';
import { ReactComponent as LandingImage } from './landing.svg';

import styles from './landing.module.css';

const Landing = () => {
  const { isVisible, toggle } = useModal(false);
  const ref = useRef(null);

  return (
    <div className={styles.landing} ref={ref}>
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
          <LandingImage className={styles.image} />
        </div>

        <Dialog isVisible={isVisible} title="Create New Map" close={toggle} ref={ref}>
          <NewMapForm />
        </Dialog>
      </div>
    </div>
  );
};

Landing.propTypes = {};

export default Landing;
