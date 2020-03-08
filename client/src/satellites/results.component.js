import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import Slider from '@astrosat/astrosat-ui/dist/forms/slider';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import { saveSatelliteSearch, pinScene } from './satellites.actions';

// FIXME: We already have an info icon in the library, why not use it?
import { ReactComponent as InfoIcon } from './info.svg';
import { ReactComponent as PinIcon } from './pin.svg';

import { VISUALISATION } from './satellites-panel.component';
import SaveSearchForm from './save-search-form.component';

import styles from './results.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';
// import infoStyles from './search.module.css';

const Results = ({ scenes, setVisiblePanel, selectScene }) => {
  const dispatch = useDispatch();

  const [cloudCoverPercentage, setCloudCoverPercentage] = useState([10]);

  const { isVisible, toggle } = useModal(false);
  const ref = useRef(null);

  return (
    scenes && (
      <div ref={ref}>
        <div className={styles.options}>
          <h3>CLOUD COVER %:</h3>

          <Slider min={0} max={100} values={cloudCoverPercentage} onChange={value => setCloudCoverPercentage(value)} />
        </div>
        <div className={styles.results}>
          <h3>RESULTS</h3>

          <div className={styles.resultCount}>
            Showing {scenes.filter(scene => scene.properties.cloudCoverAsPercentage <= cloudCoverPercentage[0]).length}{' '}
            Results
          </div>

          <ul className={styles.scenes}>
            {scenes
              .filter(scene => scene.properties.cloudCoverAsPercentage <= cloudCoverPercentage[0])
              .map(scene => {
                return (
                  <li key={scene.id} className={styles.scene}>
                    <PinIcon
                      className={styles.pinIcon}
                      onClick={() => {
                        console.log('Pin Scene: ', scene);
                        dispatch(pinScene(scene));
                      }}
                    />

                    <div
                      className={styles.scene}
                      onClick={() => {
                        dispatch(selectScene(scene));
                        setVisiblePanel(VISUALISATION);
                      }}
                    >
                      <img className={styles.thumbnail} src={scene.thumbnail} alt="Thumbnail" />
                      <ul className={styles.metadata}>
                        <li>{format(parseISO(scene.properties.created), 'dd-MM-yyyy')}</li>
                        <li>{format(parseISO(scene.properties.created), 'kk:mm:ss')} UTC</li>
                        <li>{scene.properties.cloudCoverAsPercentage} %</li>
                        <li>{scene.properties.crs}</li>
                        <li>{scene.properties.label}</li>
                      </ul>
                    </div>

                    <div className={styles.sceneOptions}>
                      <div
                        className={styles.moreInfo}
                        onClick={() => {
                          console.log('SEE MORE INFO: ', scene);
                          // setIsInfoVisible(!isInfoVisible);
                          // setInfo({ id: scene.id, description: scene.properties.moreInfo.key });
                          // setSelectedSceneI(scene);
                        }}
                      >
                        <InfoIcon className={styles.moreInfoIcon} />
                        <span>More info</span>
                      </div>

                      <div>
                        {scene.properties.tier === 'free' && <span className={styles.freeProduct}>Free Product</span>}
                      </div>
                      <Button theme="tertiary" onClick={() => console.log('Download SCENE: ', scene)}>
                        Download
                      </Button>
                    </div>
                  </li>
                );
              })}
          </ul>

          <div className={sideMenuStyles.buttons}>
            <Button classNames={[sideMenuStyles.button]} theme="primary" onClick={() => toggle()}>
              Save Search
            </Button>
          </div>
        </div>

        <Dialog isVisible={isVisible} title="Name Search" close={toggle} ref={ref}>
          <SaveSearchForm />
        </Dialog>
      </div>
    )
  );
};

Results.propTypes = {};

export default Results;
