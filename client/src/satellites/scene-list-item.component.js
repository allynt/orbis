import React from 'react';
import { useDispatch } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import { VISUALISATION } from './satellites-panel.component';

import InfoIcon from '@astrosat/astrosat-ui/dist/icons/info-icon';

import styles from './scene-list-item.module.css';

const SceneListItem = ({
  index,
  scene,
  icon,
  selectScene,
  setVisiblePanel,
  setSelectedMoreInfo,
  toggleMoreInfoDialog
}) => {
  const dispatch = useDispatch();
  return (
    <li key={`${scene.id}-${index}`} className={styles.scene}>
      <div className={styles.icon}>{icon}</div>

      <div
        className={styles.sceneSection}
        onClick={() => {
          if (selectScene) {
            dispatch(selectScene(scene));
            setVisiblePanel(VISUALISATION);
          }
        }}
      >
        <div className={styles.thumbContainer}>
          <picture>
            <img className={styles.thumbnail} src={scene.thumbnail_url} alt="Thumbnail of a satellite scene" />
          </picture>
        </div>
        <ul className={styles.metadata}>
          <li>{format(parseISO(scene.created), DATE_FORMAT)}</li>
          <li>{format(parseISO(scene.created), TIME_FORMAT)} UTC</li>
          <li>{scene.cloudCover} %</li>
          <li>{scene.id}</li>
        </ul>
      </div>

      <div className={`${styles.sceneSection} ${styles.sceneOptions}`}>
        <div
          className={styles.moreInfo}
          onClick={() => {
            setSelectedMoreInfo({
              id: 1,
              description: 'Scenes Description'
            });
            toggleMoreInfoDialog();
          }}
        >
          <InfoIcon classes={styles.moreInfoIcon} />
          <span>More info</span>
        </div>

        <div className={styles.freeProductContainer}>
          {scene.tier === 'free' && <span className={styles.freeProduct}>Free Product</span>}
        </div>
      </div>
    </li>
  );
};

export default SceneListItem;
