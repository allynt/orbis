import {
  CloseIcon,
  Dialog,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';
import { omit, pick } from 'lodash';
import * as React from 'react';

const useStyles = makeStyles({
  closeButton: {
    position: 'absolute',
    right: 0,
  },
});

/**
 * @template P
 * @param {{
 *   feature: import('typings/orbis').GeoJsonFeature<P>
 *   open?: boolean
 *   titleProperty?: keyof P
 *   blacklist?: (keyof P)[]
 *   whitelist?: (keyof P)[]
 *   onClose?: () => void
 * }} param0
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

  const title = !!titleProperty ? feature.properties[titleProperty] : 'Feature';

  const renderableProperties = React.useMemo(() => {
    let properties = feature.properties;
    // @ts-ignore
    if (!!titleProperty) properties = omit(properties, titleProperty);
    // @ts-ignore
    if (blacklist?.length) properties = omit(properties, blacklist);
    if (whitelist?.length) properties = pick(properties, whitelist);
    return properties;
  }, [blacklist, feature.properties, titleProperty, whitelist]);

  return (
    <Dialog open={open}>
      <IconButton className={styles.closeButton} onClick={onClose}>
        <CloseIcon titleAccess="Close" />
      </IconButton>
      <DialogTitle>{title}</DialogTitle>
      {Object.entries(renderableProperties).map(([key, value]) => (
        <>
          <Typography>{key}</Typography>
          <Typography>{value.toString()}</Typography>
        </>
      ))}
    </Dialog>
  );
};
