import React from 'react';
import { useDispatch } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import { VISUALISATION } from './satellites-panel.component';

import { ReactComponent as InfoIcon } from './info.svg';

import styles from './scene-list-item.module.css';
import resultsStyles from './results.module.css';

const SceneListItem = ({
  index,
  scene,
  icon,
  selectScene,
  setVisiblePanel,
  setSelectedSceneMoreInfo,
  toggleSceneMoreInfoDialog
}) => {
  const dispatch = useDispatch();
  return (
    <li key={`${scene.id}-${index}`} className={resultsStyles.scene}>
      <div className={styles.icon}>{icon}</div>

      <div
        className={resultsStyles.sceneSection}
        onClick={() => {
          if (selectScene) {
            dispatch(selectScene(scene));
            setVisiblePanel(VISUALISATION);
          }
        }}
      >
        <div className={resultsStyles.thumbContainer}>
          <picture>
            <img className={resultsStyles.thumbnail} src={scene.thumbnail_url} alt="Thumbnail of a satellite scene" />
          </picture>
        </div>
        <ul className={resultsStyles.metadata}>
          <li>{format(parseISO(scene.created), DATE_FORMAT)}</li>
          <li>{format(parseISO(scene.created), TIME_FORMAT)} UTC</li>
          <li>{scene.cloudCover} %</li>
          <li>{scene.id}</li>
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
          {scene.tier === 'free' && <span className={resultsStyles.freeProduct}>Free Product</span>}
        </div>
      </div>
    </li>
  );
};

export default SceneListItem;
