import React from 'react';

import styles from './health-infrastructure.module.css';

import { ReactComponent as CareHomeIcon } from './care-home.svg';
import { ReactComponent as GpIcon } from './gp-surgeries.svg';
import { ReactComponent as HospitalIcon } from './hospitals.svg';
import { ReactComponent as NhsIcon } from './nhs.svg';
import { ReactComponent as PharmacyIcon } from './pharmacies.svg';
import { ReactComponent as LocalAuthorityAgencyIcon } from './local-authority-agency.svg';
import { ReactComponent as HealthAndSocialCareTrustIcon } from './health-and-social-care-trust.svg';

const types = [
  { name: 'Hospital', icon: HospitalIcon },
  { name: 'GP Surgery', icon: GpIcon },
  { name: 'NHS', icon: NhsIcon },
  { name: 'Pharmacy', icon: PharmacyIcon },
  { name: 'Care Home', icon: CareHomeIcon },
  { name: 'Local authority agency', icon: LocalAuthorityAgencyIcon },
  { name: 'Health & social care trust', icon: HealthAndSocialCareTrustIcon },
];

export const HealthInfrastructure = () => (
  <ul>
    {types.map(type => {
      const Icon = type.icon;
      return (
        <li key={type.name} className={styles.listItem}>
          <div className={`${styles.icon} ${!Icon && styles.noIcon}`}>
            {type.icon && <Icon />}
          </div>
          {type.name}
        </li>
      );
    })}
  </ul>
);
