import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { fetchPinnedScenes } from './satellites.actions';

import { ReactComponent as InfoIcon } from './info.svg';
import { ReactComponent as PinIcon } from './pin.svg';

import styles from './compare-pins.module.css';
import resultsStyles from './results.module.css';

const ComparePins = () => {
  const dispatch = useDispatch();

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [info, setInfo] = useState(null);

  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);
  console.log('PINNED SCENES: ', pinnedScenes);

  useEffect(() => {
    if (!pinnedScenes) {
      dispatch(fetchPinnedScenes());
    }
  }, [pinnedScenes]);

  return (
    <div>
      <div className={styles.buttons}>
        <Button theme="primary" onClick={event => console.log('COMPARE: ', event)}>
          Compare
        </Button>
        <Button theme="tertiary" onClick={event => console.log('CLEAR PINS: ', event)}>
          Clear Pins
        </Button>
      </div>
      <ul className={styles.pinnedScenes}>
        {pinnedScenes &&
          pinnedScenes.map(scene => {
            return (
              <li key={scene.id} className={styles.scene}>
                <PinIcon
                  className={resultsStyles.pinIcon}
                  onClick={() => {
                    console.log('Delete Scene: ', scene);
                    // dispatch(pinScene(scene));
                  }}
                />

                <div
                  className={styles.scene}
                  onClick={() => {
                    console.log('CLICKED SCENE: ', scene);
                  }}
                >
                  <img className={resultsStyles.thumbnail} src={scene.thumbnail} alt="Thumbnail" />
                  <ul className={resultsStyles.metadata}>
                    <li>{format(parseISO(scene.properties.created), 'dd-MM-yyyy')}</li>
                    <li>{format(parseISO(scene.properties.created), 'kk:mm:ss')} UTC</li>
                    <li>{scene.properties.cloudCoverAsPercentage} %</li>
                    <li>{scene.properties.crs}</li>
                    <li>{scene.properties.label}</li>
                  </ul>
                </div>

                <div className={resultsStyles.sceneOptions}>
                  <div
                    className={resultsStyles.moreInfo}
                    onClick={() => {
                      // console.log('SET SCENE INFO: ', scene);
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
    </div>
  );
};

ComparePins.propTypes = {};

export default ComparePins;
