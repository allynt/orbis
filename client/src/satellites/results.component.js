import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import Slider from '@astrosat/astrosat-ui/dist/forms/slider';
import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';
import InfoIcon from '@astrosat/astrosat-ui/dist/icons/info-icon';

import { saveSatelliteSearch, pinScene } from './satellites.actions';

// FIXME: We already have an info icon in the library, why not use it?
import { ReactComponent as PinIcon } from './pin.svg';

import { VISUALISATION } from './satellites-panel.component';
import SaveSearchForm from './save-search-form.component';

import styles from './results.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const Results = ({ scenes, setVisiblePanel, selectScene }) => {
  const dispatch = useDispatch();
  const currentSearchQuery = useSelector(state => state.satellites.currentSearchQuery);

  const [cloudCoverPercentage, setCloudCoverPercentage] = useState([10]);
  const [selectedMoreInfo, setSelectedMoreInfo] = useState(null);
  console.log('SELECTED MORE INFO: ', selectedMoreInfo);

  const [isSaveDialogVisible, toggleSaveDialog] = useModal(false);
  const [isMoreInfoDialogVisible, toggleMoreInfoDialog] = useModal(false);
  const ref = useRef(null);

  return (
    scenes && (
      <div className={styles.options} ref={ref}>
        <div>
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
                      className={styles.sceneContent}
                      onClick={() => {
                        dispatch(selectScene(scene));
                        setVisiblePanel(VISUALISATION);
                      }}
                    >
                      <div className={styles.thumbContainer}>
                        <img className={styles.thumbnail} src={scene.thumbnail} alt="Thumbnail" />
                      </div>
                      <ul className={styles.metadata}>
                        <li>{format(parseISO(scene.properties.created), DATE_FORMAT)}</li>
                        <li>{format(parseISO(scene.properties.created), TIME_FORMAT)} UTC</li>
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
                          toggleMoreInfoDialog();
                          setSelectedMoreInfo({ id: scene.id, description: scene.properties.moreInfo.key });
                        }}
                      >
                        <InfoIcon classes={[styles.moreInfoIcon]} />
                        <span>More info</span>
                      </div>

                      <div className={styles.freeProductContainer}>
                        {scene.properties.tier === 'free' && <span className={styles.freeProduct}>Free Product</span>}
                      </div>
                    </div>
                    <Button theme="tertiary" onClick={() => console.log('Download SCENE: ', scene)}>
                      Download
                    </Button>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className={sideMenuStyles.buttons}>
          <Button classNames={[sideMenuStyles.button]} theme="primary" onClick={() => toggleSaveDialog()}>
            Save Search
          </Button>
        </div>

        <Dialog isVisible={isSaveDialogVisible} title="Name Search" close={toggleSaveDialog} ref={ref}>
          <SaveSearchForm query={currentSearchQuery} />
        </Dialog>

        <Dialog isVisible={isMoreInfoDialogVisible} title="More Info" close={toggleMoreInfoDialog} ref={ref}>
          <div>
            <h3>More Info</h3>
            <table className={styles.moreInfoContent}>
              <thead>
                <tr>
                  <th scope="col">Label</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>

              <tbody>
                {selectedMoreInfo &&
                  Object.keys(selectedMoreInfo).map(key => {
                    return (
                      <tr key={key}>
                        <td>{key}:</td>
                        <td>{selectedMoreInfo[key]}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Dialog>
      </div>
    )
  );
};

Results.propTypes = {};

export default Results;
