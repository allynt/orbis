import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Switch from '@astrosat/astrosat-ui/dist/buttons/switch';
import Checkbox from '@astrosat/astrosat-ui/dist/forms/checkbox';
import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import {
  fetchPinnedScenes,
  selectPinnedScene,
  clearSelectedPinnedScenes,
  deletePinnedScene
} from './satellites.actions';
import { toggleCompareMaps } from '../map/map.actions';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import { ReactComponent as InfoIcon } from './info.svg';
import { ReactComponent as PinIcon } from './pin.svg';

import styles from './compare-pins.module.css';
import resultsStyles from './results.module.css';

const MAX_SELECTED = 2;

const ComparePins = () => {
  const dispatch = useDispatch();

  const pinnedScenes = useSelector(state => state.satellites.pinnedScenes);
  const isCompareMode = useSelector(state => state.map.isCompareMode);
  const selectedPinnedScenes = useSelector(state => state.satellites.selectedPinnedScenes);
  console.log('SELECTED PINNED SCENES: ', selectedPinnedScenes);

  const ref = useRef(null);
  const [isSceneMoreInfoDialogVisible, toggleSceneMoreInfoDialog] = useModal(false);
  const [selectedSceneMoreInfo, setSelectedSceneMoreInfo] = useState(null);

  useEffect(() => {
    if (!pinnedScenes) {
      dispatch(fetchPinnedScenes());
    }
  }, [pinnedScenes]);

  return (
    <div ref={ref}>
      <div className={styles.buttons}>
        <Switch
          name="compare"
          label="Compare"
          clicked={isCompareMode}
          onClick={() => dispatch(toggleCompareMaps())}
          ariaLabel="Compare"
        />
        <Button theme="tertiary" onClick={() => dispatch(clearSelectedPinnedScenes([]))}>
          Clear Pins
        </Button>
      </div>
      <ul className={styles.pinnedScenes}>
        {pinnedScenes &&
          pinnedScenes.map((scene, index) => {
            return (
              <li key={`${scene.id}-${index}`} className={styles.scene}>
                <Checkbox
                  name={scene.id}
                  label={scene.label}
                  checked={selectedPinnedScenes.find(selectedScene => selectedScene.id === scene.id)}
                  onChange={() => {
                    if (selectedPinnedScenes.length !== MAX_SELECTED) {
                      dispatch(selectPinnedScene(scene));
                    }
                  }}
                />

                <PinIcon
                  className={styles.pinIcon}
                  onClick={() => {
                    dispatch(deletePinnedScene(scene.id));
                  }}
                />

                <div className={styles.scene}>
                  <img className={resultsStyles.thumbnail} src={scene.thumbnail} alt="Thumbnail" />
                  <ul className={resultsStyles.metadata}>
                    <li>{format(parseISO(scene.properties.created), DATE_FORMAT)}</li>
                    <li>{format(parseISO(scene.properties.created), TIME_FORMAT)} UTC</li>
                    <li>{scene.properties.cloudCoverAsPercentage} %</li>
                    <li>{scene.properties.crs}</li>
                    <li>{scene.properties.label}</li>
                  </ul>
                </div>

                <div className={resultsStyles.sceneOptions}>
                  <div
                    className={resultsStyles.moreInfo}
                    onClick={() => {
                      setSelectedSceneMoreInfo({ id: 1, description: 'Some text' });
                      toggleSceneMoreInfoDialog();
                    }}
                  >
                    <InfoIcon className={styles.moreInfoIcon} />
                    <span>More info</span>
                  </div>

                  <div>
                    {scene.properties.tier === 'free' && <span className={styles.freeProduct}>Free Product</span>}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>

      <Dialog
        isVisible={isSceneMoreInfoDialogVisible}
        title="Resolution Info"
        close={toggleSceneMoreInfoDialog}
        ref={ref}
      >
        <div>
          <h3>Resolution More Info</h3>
          <table className={styles.moreInfoContent}>
            <thead>
              <tr>
                <th scope="col">Label</th>
                <th scope="col">Value</th>
              </tr>
            </thead>

            <thead>
              {selectedSceneMoreInfo &&
                Object.keys(selectedSceneMoreInfo).map(key => {
                  return (
                    <tr key={key}>
                      <td>{key}:</td>
                      <td>{selectedSceneMoreInfo[key]}</td>
                    </tr>
                  );
                })}
            </thead>
          </table>
        </div>
      </Dialog>
    </div>
  );
};

ComparePins.propTypes = {};

export default ComparePins;