import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { omit, pick } from 'lodash';

import { isRealValue } from 'utils/isRealValue';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: 0,
    color: theme.palette.secondary.main,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 50%',
    padding: 0,
  },
  divider: {
    gridColumn: '1/-1',
  },
  item: {
    padding: theme.spacing(4, 5),
  },
  key: {
    ...theme.typography.h2,
    padding: theme.spacing(4, 10),
  },
}));

/**
 * @typedef {{
 *   titleProperty?: string
 *   blacklist?: string[]
 *   whitelist?: string[]
 * }} MetadataFeatureDialogProps
 */

/**
 * @template P
 * @param {{
 *   feature: import('typings').GeoJsonFeature<P>
 *   open?: boolean
 *   onClose?: () => void
 * } & MetadataFeatureDialogProps} param0
 */
export const FeatureDialog = ({
  feature,
  open,
  titleProperty,
  blacklist,
  whitelist,
  onClose,
}) => {
  if (!!blacklist && !!whitelist)
    console.warn(
      `You probably don't want to use blacklist and whitelist together in FeatureDialog`,
    );

  const styles = useStyles();

  const title = !!titleProperty
    ? feature?.properties[titleProperty]
    : 'Feature';

  const renderableProperties = React.useMemo(() => {
    let properties = feature?.properties;
    // @ts-ignore
    if (!!titleProperty) properties = omit(properties, titleProperty);
    // @ts-ignore
    if (blacklist?.length) properties = omit(properties, blacklist);
    if (whitelist?.length) properties = pick(properties, whitelist);
    return properties;
  }, [blacklist, feature, titleProperty, whitelist]);

  return !!feature ? (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle onClose={onClose}>{title}</DialogTitle>
      <DialogContent className={styles.content}>
        {Object.entries(renderableProperties).map(([key, value]) => (
          <React.Fragment key={`${key}-${value}`}>
            <Typography className={styles.key}>{key}</Typography>
            <Typography className={styles.item}>
              {isRealValue(value) ? value.toString() : '-'}
            </Typography>
            <Divider className={styles.divider} />
          </React.Fragment>
        ))}
      </DialogContent>
    </Dialog>
  ) : null;
};
