import React from 'react';

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { COLORS } from '../nature-scotland.constants';

const useStyles = makeStyles(theme => ({
  listItem: {
    backgroundColor: '#333f48',
    justifyContent: 'space-between',
    color: '#ffffff',
    '& p': {
      color: '#ffffff',
    },
    margin: '0.5rem',
    borderRadius: '0.3rem',
  },
  leftSide: {
    display: 'flex',
    alignItems: 'center',
    // minWidth: '50rem',
  },
  strapline: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  straplineLabel: {
    paddingRight: '0.5rem',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    width: '125px',
  },
  warning: {
    // color: COLORS[0], //FIXME: Why isn't this working
    color: '#f67971',
  },
  'not-good': {
    // color: COLORS[1],
    color: '#eea46c',
  },
  neutral: {
    // color: COLORS[2],
    color: '#d8c06a',
  },
  good: {
    // color: COLORS[3],
    color: '#b3d567',
  },
  'very-good': {
    // color: COLORS[4],
    color: '#7ef664',
  },
}));

const STATUSES = [
  {
    type: 'warning',
    icon: 'warning',
    label: 'Warning',
  },
  {
    type: 'not-good',
    icon: 'not-good',
    label: 'Not Good',
  },
  {
    type: 'neutral',
    icon: 'neutral',
    label: 'Neutral',
  },
  {
    type: 'good',
    icon: 'good',
    label: 'Good',
  },
  {
    type: 'very-good',
    icon: 'very-good',
    label: 'Very Good',
  },
];

const ProtectedFeatureList = ({ features }) => {
  const styles = useStyles();

  return (
    <List>
      {features.map(({ id, icon, title, description, type }) => {
        const status = STATUSES.find(status => status.type === type);

        return (
          <ListItem
            key={id}
            className={styles.listItem}
            onClick={() =>
              console.log('List item clicked: ', {
                id,
                icon,
                title,
                description,
                type,
              })
            }
          >
            <div className={styles.leftSide}>
              {/* <ListItemAvatar>
                <Avatar src={icon} alt={title} />
              </ListItemAvatar> */}

              <ListItemText
                primaryTypographyProps={{ variant: 'h4', component: 'span' }}
                primary={title}
                secondary={
                  <div className={styles.strapline}>
                    <Typography className={styles.straplineLabel}>
                      Protection Type:
                    </Typography>
                    <Typography variant="h4">{description}</Typography>
                  </div>
                }
              />
            </div>

            <div className={styles.status}>
              {/* <ListItemAvatar>
                <Avatar src={status.icon} className={styles[status.type]} />
              </ListItemAvatar> */}

              <ListItemText
                primary={status.label}
                className={styles[status.type]}
              />
            </div>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ProtectedFeatureList;
