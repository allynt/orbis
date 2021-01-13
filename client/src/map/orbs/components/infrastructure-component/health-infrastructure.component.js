import * as React from 'react';

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
} from '@astrosat/astrosat-ui';

import { ReactComponent as CareHomeIcon } from './care-home.svg';
import { ReactComponent as GpIcon } from './gp-surgeries.svg';
import { ReactComponent as HealthAndSocialCareTrustIcon } from './health-and-social-care-trust.svg';
import { ReactComponent as HospitalIcon } from './hospitals.svg';
import { ReactComponent as LocalAuthorityAgencyIcon } from './local-authority-agency.svg';
import { ReactComponent as NhsIcon } from './nhs.svg';
import { ReactComponent as PharmacyIcon } from './pharmacies.svg';

const TYPES = [
  { name: 'Hospital', icon: HospitalIcon },
  { name: 'GP Surgery', icon: GpIcon },
  { name: 'NHS', icon: NhsIcon },
  { name: 'Pharmacy', icon: PharmacyIcon },
  { name: 'Care Home', icon: CareHomeIcon },
  { name: 'Local authority agency', icon: LocalAuthorityAgencyIcon },
  { name: 'Health & social care trust', icon: HealthAndSocialCareTrustIcon },
];

const IconWrapper = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

export const HealthInfrastructure = () => (
  <List>
    {TYPES.map(type => {
      const Icon = type.icon;
      return (
        <ListItem key={type.name}>
          <ListItemAvatar>
            <IconWrapper>{type.icon && <Icon />}</IconWrapper>
          </ListItemAvatar>
          <ListItemText primary={type.name} />
        </ListItem>
      );
    })}
  </List>
);
