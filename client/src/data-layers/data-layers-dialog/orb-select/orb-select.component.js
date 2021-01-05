import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  categories: {
    width: '40%',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.primary,
  },
  list: {
    padding: '1.375rem',
    overflowY: 'auto',
    height: '100%',
  },
  listItem: {
    opacity: 0.55,
    transition: theme.transitions.create('opacity'),
    '&$selected': {
      opacity: 1,
      background: 'none',
    },
  },
  listItemText: {
    fontWeight: 'bold',
  },
  selected: {},
}));

/**
 * @param {{
 *   orbs: import('typings/orbis').Orb[]
 *   selectedOrbName?: import('typings/orbis').Orb['name']
 *   onOrbClick: (orb: import('typings/orbis').Orb['name']) => void
 * }} props
 */
export const OrbSelect = ({ orbs, selectedOrbName, onOrbClick }) => {
  const styles = useStyles();
  return (
    <div className={styles.categories}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        pt={3}
        pb={2}
        borderBottom={1}
        borderColor="grey.500"
        component={Typography}
        variant="h2"
      >
        Select Your Orb
      </Box>
      <List className={styles.list}>
        {orbs?.map(orb => (
          <ListItem
            button
            className={clsx(styles.listItem, {
              [styles.selected]: orb.name === selectedOrbName,
            })}
            key={orb.name}
            selected={orb.name === selectedOrbName}
            onClick={() => onOrbClick(orb.name)}
          >
            <ListItemIcon>
              <span className={styles.icon} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                variant: 'h3',
                className: styles.listItemText,
              }}
              primary={orb.name}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
