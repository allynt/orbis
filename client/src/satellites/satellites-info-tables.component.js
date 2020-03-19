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

export const SceneInfoTable = ({ scene }) => (
  <table className={styles.table}>
    <tbody>
      <tr className={styles.row}>
        <td className={styles.title}>Summary: </td>
        <td>
          <table>
            <tbody>
              {Object.keys(scene.metadata.summary).map(key => {
                const [first, ...rest] = key;
                const title = `${first.toUpperCase()}${rest.join('')}`;
                return (
                  <tr>
                    <td className={styles.title}>{title}</td>
                    <td>{scene.metadata.summary[key] || 'not currently available'}</td>
                  </tr>
                );
              })}
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
