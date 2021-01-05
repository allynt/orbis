import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React from 'react';
import { Header } from '../components/header.component';
import { List } from '../components/list.component';
import { Section } from '../components/section.component';

const useStyles = makeStyles(theme => ({
  categories: {
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
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
    }),
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
    <Section orientation="left" className={styles.categories}>
      <Header>Select Your Orb</Header>
      <List>
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
    </Section>
  );
};
