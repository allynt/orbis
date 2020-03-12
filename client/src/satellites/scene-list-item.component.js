import React from 'react';
import { useDispatch } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';
import { ReactComponent as InfoIcon } from './info.svg';
import { ReactComponent as DeleteIcon } from './delete.svg';
import { ReactComponent as PinIcon } from './pin.svg';

import styles from './compare-pins.module.css';
import resultsStyles from './results.module.css';

const SceneListItem = ({
  index,
  scene,
  icon,
  pinScene,
  setSelectedSceneMoreInfo,
  toggleSceneMoreInfoDialog,
  deletePinnedScene
}) => {
  const dispatch = useDispatch();
  return (
    <li key={`${scene.id}-${index}`} className={resultsStyles.scene}>
      {icon === 'pin' && (
        <PinIcon
          className={styles.pinIcon}
          onClick={() => {
            console.log('Pin Scene: ', scene);
            if (pinScene) {
              dispatch(pinScene(scene));
            }
          }}
        />
      )}

      {icon === 'delete' && (
        <DeleteIcon
          className={resultsStyles.pinIcon}
          onClick={() => {
            dispatch(deletePinnedScene(scene.id));
          }}
        />
      )}

      <div className={resultsStyles.sceneSection}>
        <div className={resultsStyles.thumbContainer}>
          <picture>
            <img className={resultsStyles.thumbnail} src={scene.thumbnail} alt="Thumbnail" />
          </picture>
        </div>
        <ul className={resultsStyles.metadata}>
          <li>{format(parseISO(scene.properties.created), DATE_FORMAT)}</li>
          <li>{format(parseISO(scene.properties.created), TIME_FORMAT)} UTC</li>
          <li>{scene.properties.cloudCoverAsPercentage} %</li>
          <li>{scene.properties.crs}</li>
          <li>{scene.properties.label}</li>
        </ul>
      </div>

      <div className={`${resultsStyles.sceneSection} ${resultsStyles.sceneOptions}`}>
        <div
          className={resultsStyles.moreInfo}
          onClick={() => {
            setSelectedSceneMoreInfo({ id: 1, description: 'Some text' });
            toggleSceneMoreInfoDialog();
          }}
        >
          <InfoIcon className={resultsStyles.moreInfoIcon} />
          <span>More info</span>
        </div>

        <div className={resultsStyles.freeProductContainer}>
          {scene.properties.tier === 'free' && <span className={resultsStyles.freeProduct}>Free Product</span>}
        </div>
      </div>
    </li>
  );
};

export default SceneListItem;
