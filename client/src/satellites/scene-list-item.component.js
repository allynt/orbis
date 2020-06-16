import React from 'react';

import { useSelector } from 'react-redux';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { DATE_FORMAT, TIME_FORMAT } from './satellite.constants';

import { VISUALISATION, SCENE } from './satellites-panel.component';
import { Skeleton } from 'components/skeleton/skeleton.component';

import InfoIcon from '@astrosat/astrosat-ui/dist/icons/info-icon';

import styles from './scene-list-item.module.css';

const SceneListItem = ({
  index,
  scene,
  icon,
  selectScene,
  setVisiblePanel,
  setSelectedMoreInfo,
  toggleMoreInfoDialog,
}) => {
  const visualisationId = useSelector(state => state.satellites.visualisationId);
  const thumbnailUrl = scene.thumbnail_url.replace(/{VISUALISATION_ID}/, visualisationId);

  return (
    <div key={`${scene.id}-${index}`} className={styles.scene}>
      <div className={styles.icon}>{icon}</div>

      <div
        className={styles.sceneSection}
        onClick={() => {
          if (selectScene) {
            selectScene(scene);
            setVisiblePanel && setVisiblePanel(VISUALISATION);
          }
        }}
      >
        <div className={styles.thumbContainer}>
          <picture>
            <img className={styles.thumbnail} src={thumbnailUrl} alt="Thumbnail of a satellite scene" />
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
            setSelectedMoreInfo({ type: SCENE, data: scene });
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
    </div>
  );
};

export const SceneListItemSkeleton = () => (
  <li className={styles.sceneSkeleton}>
    <div className={styles.sceneSection}>
      <div className={styles.thumbContainer}>
        <Skeleton width="6.5rem" height="6.5rem" />
      </div>
      <ul className={styles.metadataSkeleton}>
        {Array(4)
          .fill(0)
          .map((num, i) => (
            <li key={i} className={styles.item}>
              <Skeleton />
            </li>
          ))}
      </ul>
    </div>

    <div className={`${styles.sceneSection} ${styles.sceneOptions}`}>
      <div className={styles.moreInfo}>
        <Skeleton />
      </div>
    </div>
  </li>
);

export default SceneListItem;
