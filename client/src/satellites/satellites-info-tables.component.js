import React from 'react';

import { format } from 'date-fns';

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
        <td className={styles.title}>Available tiers: </td>
        <td>
          <ul>
            {satellite.tiers.map(tier => (
              <li key={tier.id}>{tier.label || 'not currently available'}</li>
            ))}
          </ul>
        </td>
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

export const SceneInfoTable = ({ scene }) => {
  const date = format(new Date(scene.metadata.summary.date), 'dd MMM yyyy');
  const time = format(new Date(scene.metadata.summary.date), 'HH:mm');
  return (
    <table className={styles.table}>
      <tbody>
        <tr className={styles.row}>
          <td className={styles.title}>Summary: </td>
          <td>
            <table>
              <tbody>
                <tr>
                  <td className={styles.title}>Date: </td>
                  <td>{date || 'not currently available'}</td>
                </tr>
                <tr>
                  <td className={styles.title}>Time: </td>
                  <td>{time || 'not currently available'}</td>
                </tr>
                <tr>
                  <td className={styles.title}>Instrument: </td>
                  <td>{scene.metadata.summary.instrument || 'not currently available'}</td>
                </tr>
                <tr>
                  <td className={styles.title}>Mode: </td>
                  <td>{scene.metadata.summary.mode || 'not currently available'}</td>
                </tr>
                <tr>
                  <td className={styles.title}>Satellite: </td>
                  <td>{scene.metadata.summary.satellite || 'not currently available'}</td>
                </tr>
                <tr>
                  <td className={styles.title}>Size: </td>
                  <td>{scene.metadata.summary.size || 'not currently available'}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.title}>Name of the instrument: </td>
          <td>{scene.metadata.name_of_instrument || 'not currently available'}</td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.title}>Operational mode of the sensor: </td>
          <td>{scene.metadata.operational_mode_of_sensor || 'not currently available'}</td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.title}>Orbit direction: </td>
          <td>{scene.metadata.orbit_direction || 'not currently available'}</td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.title}>Product type: </td>
          <td>{scene.metadata.product_type || 'not currently available'}</td>
        </tr>
        <tr className={styles.row}>
          <td className={styles.title}>Orbit direction: </td>
          <td>{scene.metadata.cloud_coverage || 'not currently available'}</td>
        </tr>
      </tbody>
    </table>
  );
};
