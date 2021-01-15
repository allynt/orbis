import * as React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { DEFAULT_TITLE, VALUE_TYPE } from './feature-detail.constants';

const NO_DATA = 'Not available';

/**
 * @typedef {import('./feature-detail.constants').ValueType} ValueType
 */
/**
 * @param {*} value
 * @returns {ValueType[keyof ValueType]}
 */
const getTypeForValue = value => {
  if (Array.isArray(value)) return VALUE_TYPE.array;
  if (typeof value === 'object' && value !== null) return VALUE_TYPE.object;
  return VALUE_TYPE.item;
};

/**
 * @param {*} value
 */
const renderItemValue = value => {
  let toRender = value;
  if (value === 'null') toRender = JSON.parse(value);
  if (typeof value === 'boolean') toRender = JSON.stringify(value);
  if (value === 0) toRender = '0';
  return toRender || NO_DATA;
};

/**
 * @param {{
 *   jsonKey?: string
 *   value: {[key: string]: any}
 * }} props
 */
const ObjectItem = ({ jsonKey, value }) => (
  <List disablePadding component="div">
    {jsonKey && (
      <ListSubheader disableSticky>
        <Typography variant="h3" component="span">
          {jsonKey}
        </Typography>
      </ListSubheader>
    )}
    {mapObject(value)}
  </List>
);

/**
 * @param {{
 *   jsonKey: string
 *   value: any
 * }} props
 */
const Item = ({ jsonKey, value }) => {
  return (
    <ListItem>
      <ListItemText
        primary={
          <>
            <b>{jsonKey} </b>
            {renderItemValue(value)}
          </>
        }
      />
    </ListItem>
  );
};

/**
 * @param {{
 *   jsonKey?: string
 *   value: any[]
 * }} props
 */
const ArrayItem = ({ jsonKey, value }) => (
  <List disablePadding>
    {jsonKey && (
      <ListSubheader disableSticky>
        <Typography variant="h3" component="span">
          {jsonKey}:
        </Typography>
      </ListSubheader>
    )}
    {value.length > 0 ? (
      value.map((item, i) => {
        switch (getTypeForValue(item)) {
          case VALUE_TYPE.array:
            return <ArrayItem key={`${jsonKey}-${i}`} value={item} />;
          case VALUE_TYPE.object:
            return <ObjectItem key={`${jsonKey}-${i}`} value={item} />;
          case VALUE_TYPE.item:
          default:
            return <ListItem key={i}>{renderItemValue(item)}</ListItem>;
        }
      })
    ) : (
      <ListItem>{NO_DATA}</ListItem>
    )}
  </List>
);

const mapObject = feature => {
  return (
    <>
      {feature &&
        Object.entries(feature).map(([jsonKey, value], i) => {
          switch (getTypeForValue(value)) {
            case VALUE_TYPE.array:
              return (
                <ArrayItem
                  key={`${jsonKey}-${i}`}
                  jsonKey={jsonKey}
                  value={value}
                />
              );
            case VALUE_TYPE.object:
              return (
                <ObjectItem
                  key={`${jsonKey}-${i}`}
                  jsonKey={jsonKey}
                  value={value}
                />
              );
            case VALUE_TYPE.item:
            default:
              return (
                <Item
                  key={`${jsonKey}-${i}`}
                  jsonKey={`${jsonKey}:`}
                  value={value}
                />
              );
          }
        })}
    </>
  );
};

/**
 * @typedef FeatureDetailProps
 * @property {{[key: string]: any}[]} [features]
 * @property {React.ReactNode} [children]
 * @property {{label: string, content: string}} [footer]
 * @property {string} [title]
 */

const useStyles = makeStyles(theme => ({
  header: {
    ...theme.typography.h3,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(1, 1, 3),
    textAlign: 'center',
  },
  content: {
    maxHeight: '30rem',
    maxWidth: '25rem',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  list: {
    '& + &': {
      borderTop: `1px solid ${theme.palette.primary.main}`,
    },
  },
}));

/**
 * @param {FeatureDetailProps} props
 */
const FeatureDetail = ({
  children,
  features,
  title = DEFAULT_TITLE,
  footer,
}) => {
  const styles = useStyles();

  return (
    <>
      <Typography className={styles.header} component="h1">
        {title}
      </Typography>
      <div className={styles.content}>
        {features &&
          features?.map(feature => (
            <List key={feature?.id} className={styles.list}>
              {mapObject(feature)}
              {footer && <Item jsonKey={footer.label} value={footer.content} />}
            </List>
          ))}
        {children && children}
      </div>
    </>
  );
};

export default FeatureDetail;
