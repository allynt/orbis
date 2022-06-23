import * as React from 'react';

import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  makeStyles,
  alpha,
} from '@astrosat/astrosat-ui';

import { get } from 'lodash';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(2, 0),
    borderBottom: `solid 1px ${theme.palette.primary.main}`,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: alpha(theme.palette.primary.main, 0.55),
  },
  secondaryProperty: {
    '& > span': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  link: {
    color: theme.palette.text.primary,
  },
}));

/**
 * @typedef {{
 *   primaryProperty?: string
 *   secondaryProperty?: string
 * }} MultipleFeaturesListMetadataProps
 */

/**
 * @param {{
 *   features: import('typings').GeoJsonFeature[]
 *   onMoreDetailsClick: (feature: import('typings').GeoJsonFeature) => void
 * } & MultipleFeaturesListMetadataProps} props
 */
export const MultipleFeaturesList = ({
  features,
  primaryProperty,
  secondaryProperty,
  onMoreDetailsClick,
}) => {
  const styles = useStyles();

  return (
    <>
      <Typography className={styles.header} variant="h3">
        More Details
      </Typography>
      <List disablePadding>
        {features?.map((feature, i) => (
          <ListItem
            component={Grid}
            container
            spacing={1}
            classes={{ divider: styles.divider }}
            alignItems="center"
            divider={i < features.length - 1}
            key={JSON.stringify(feature.properties)}
          >
            {!!primaryProperty ? (
              <Grid item xs>
                <Typography>
                  {get(feature.properties, primaryProperty)}
                </Typography>
              </Grid>
            ) : null}
            {!!secondaryProperty ? (
              <Grid item xs>
                <Typography className={styles.secondaryProperty}>
                  <span>{secondaryProperty}: </span>
                  {get(feature.properties, secondaryProperty)}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs container justifyContent="flex-end">
              <Link
                className={styles.link}
                component="button"
                onClick={() => onMoreDetailsClick(feature)}
              >
                More details
              </Link>
            </Grid>
          </ListItem>
        ))}
      </List>
    </>
  );
};
