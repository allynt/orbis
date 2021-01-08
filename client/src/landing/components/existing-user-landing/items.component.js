import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import { Box, Avatar, Paper, makeStyles } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { DATE_FORMAT } from '../landing-constants';

const useStyles = makeStyles(theme => ({
  itemImage: {
    height: '12rem',
    alignSelf: 'center',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    borderRadius: '1rem',
    overflow: 'hidden',
    opacity: '0.7',
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  itemAvatar: {
    width: '100%',
    height: '100%',
  },
  creationDate: {
    opacity: '0.5',
    fontSize: theme.typography.pxToRem(12),
    padding: '0.3rem 0',
    margin: '0',
  },
}));

export const Items = ({ items, chooseItem }) => {
  const [item, setItem] = useState(null);
  const styles = useStyles();

  if (item) {
    chooseItem(item);

    const viewport = { center: item.center, zoom: item.zoom };
    const queryString = encodeURI(JSON.stringify(viewport));
    return <Redirect to={`/map/${queryString}`} />;
  }
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      flexWrap="wrap"
      overflow="overlay"
      maxHeight="35rem"
    >
      {items.map(item => {
        const date = format(new Date(item.created), DATE_FORMAT);

        return (
          <Box key={item.title} width="17rem">
            <Box className={styles.itemImage} onClick={() => setItem(item)}>
              <Avatar
                component={Paper}
                variant="square"
                className={styles.itemAvatar}
                src={item.thumbnail}
                alt={item.title}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              minHeight="1.5rem"
              padding="0.3rem 0"
            >
              <Box component="div">
                <Box
                  component="h3"
                  padding="0.3rem 0"
                  margin="0"
                  fontSize="inherit"
                  font-weight="inherit"
                >
                  {item.title}
                </Box>
                <Box component="p" className={styles.creationDate}>
                  {`Created ${date}`}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
