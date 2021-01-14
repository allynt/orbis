import * as React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { FeatureDetail } from 'components';

const DEFAULT_TITLE = 'Feature Details';
const NOT_AVAILABLE = 'Not Available';

const getCategoriesString = items => {
  return items.length
    ? items
        .reduce((acc, cur) => [...acc, cur.Category], [])
        .slice()
        .sort()
        .join(', ')
    : [NOT_AVAILABLE];
};

const useStyles = makeStyles(theme => ({
  secondaryText: {
    ...theme.typography.body1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  clickMessage: {
    ...theme.typography.body1,
    paddingLeft: theme.spacing(2),
  },
  divider: {
    borderColor: theme.palette.primary.dark,
  },
}));

const MultipleSupplierContent = ({ suppliers, onSupplierClick }) => {
  const styles = useStyles();

  return (
    <List dense>
      {suppliers.map(supplier => (
        <ListItem
          classes={{ divider: styles.divider }}
          divider
          key={`${supplier.Name}${supplier.Postcode}`}
          button
          onClick={e => onSupplierClick(supplier, e)}
        >
          <ListItemText
            disableTypography
            primary={<Typography variant="body1">{supplier.Name}</Typography>}
            secondary={
              <Typography className={styles.secondaryText}>
                <b>I can provide: </b>
                {getCategoriesString(supplier.Items)}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

const MySupplyLynkFeatureDetail = ({ data, onSupplierClick }) => {
  const styles = useStyles();
  if (data.length === 1) {
    const feature = Object.entries(data[0]).reduce((acc, [key, value]) => {
      if (key === 'URL') return { ...acc, Website: value };
      if (key === 'Items') return { ...acc, [key]: value.map(i => i.Category) };
      return { ...acc, [key]: value };
    }, {});
    return (
      <FeatureDetail title={data[0]?.Name} features={[feature]}>
        <Typography className={styles.clickMessage}>
          Click for details!
        </Typography>
      </FeatureDetail>
    );
  }

  return (
    <FeatureDetail title={DEFAULT_TITLE}>
      <MultipleSupplierContent
        suppliers={data}
        onSupplierClick={onSupplierClick}
      />
    </FeatureDetail>
  );
};

export default MySupplyLynkFeatureDetail;
