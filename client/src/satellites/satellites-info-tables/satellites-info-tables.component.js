import React from 'react';

import styles from './satellites-info-tables.module.css';

export const TierInfoTable = ({ tier }) => (
  <table className={styles.table}>
    <tbody>
      <tr className={styles.row}>
        <td className={styles.title}>Tier: </td>
        <td>{tier.label || 'not currently available'}</td>
      </tr>
      <tr className={styles.row}>
        <td className={styles.title}>Description: </td>
        <td>{tier.description || 'not currently available'}</td>
      </tr>
    </tbody>
  </table>
);

export const SatelliteInfoTable = ({ satellite }) => (
  <table className={styles.table}>
    <tbody>
      <tr className={styles.row}>
        <td className={styles.title}>Name: </td>
        <td>{satellite.label || 'not currently available'}</td>
      </tr>
      <tr className={styles.row}>
        <td className={styles.title}>Description: </td>
        <td>{satellite.description || 'not currently available'}</td>
      </tr>
      <tr className={styles.row}>
        <td className={styles.title}>Available visualisations: </td>
        <td>
          <ul>
            {satellite.visualisations.map(vis => (
              <li key={vis.id}>{vis.label || 'not currently available'}</li>
            ))}
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
);

export const SceneInfoTable = ({ scene }) => (
  <table className={styles.table}>
    <tbody>
      {Object.keys(scene.metadata).map(key => (
        <tr className={styles.row}>
          <td className={styles.title}>{key}</td>
          <td>{scene.metadata[key] || 'not currently available'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
