/* eslint-disable react/no-array-index-key */
import * as React from 'react';

import {
  Link,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { format, isValid } from 'date-fns';
import { omit, pick, get } from 'lodash';

import { isEmail } from 'utils/text';

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
  if (isValid(new Date(value))) return VALUE_TYPE.date;
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
  if (isEmail(value)) toRender = <Link href={`mailto: ${value}`}>{value}</Link>;
  return toRender || NO_DATA;
};

/**
 * @param {{
 *   jsonKey?: string
 *   value: {[key: string]: any}
 *   labelMapping?: {[key: string]: string}
 * }} props
 */
const ObjectItem = ({ jsonKey, value, labelMapping }) => (
  <List disablePadding component="div">
    {jsonKey && (
      <ListSubheader disableSticky>
        <Typography variant="h3" component="span">
          {jsonKey}
        </Typography>
      </ListSubheader>
    )}
    {mapObject(value, labelMapping)}
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
            <b>{jsonKey}: </b>
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

/**
 * @param {{[key: string]: any}} feature
 * @param {{[key: string]: string}} [labelMapping]
 * @param {string} [dateFormat]
 * @returns
 */
const mapObject = (feature, labelMapping, dateFormat) => {
  return (
    <>
      {feature &&
        Object.entries(feature).map(([jsonKey, value], i) => {
          const props = {
            key: `${jsonKey}-${i}`,
            jsonKey: labelMapping?.[jsonKey] ? labelMapping[jsonKey] : jsonKey,
            value,
          };

          switch (getTypeForValue(value)) {
            case VALUE_TYPE.date:
              const updatedProps = {
                ...props,
                value: format(new Date(value), dateFormat),
              };
              return <Item {...updatedProps} />;
            case VALUE_TYPE.array:
              return <ArrayItem {...props} />;
            case VALUE_TYPE.object:
              return <ObjectItem labelMapping={labelMapping} {...props} />;
            case VALUE_TYPE.item:
            default:
              return <Item {...props} />;
          }
        })}
    </>
  );
};

/**
 * @typedef FeatureDetailProps
 * @property {{[key: string]: any}[]} [features]
 * @property {React.ReactNode} [children]
 * @property {string} [titleProperty]
 * @property {string[]} [propertiesToOmit]
 * @property {string[]} [propertiesToPick]
 * @property {string} [dateFormat]
 * @property {(obj: object) => React.ReactNode|null} [postFeatureComponent]
 * @property {{label: string, content: string}} [footer]
 * @property {string} [title]
 * @property {{[key: string]: string}} [labelMapping]
 */

const useStyles = makeStyles(theme => ({
  header: {
    ...theme.typography.h3,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(1, 1, 3),
    textAlign: 'center',
  },
  content: {
    maxHeight: '40rem',
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
  titleProperty,
  propertiesToOmit,
  propertiesToPick,
  dateFormat = 'dd/MM/yyyy',
  postFeatureComponent,
  labelMapping,
  footer,
}) => {
  const styles = useStyles();

  return (
    <>
      <Typography className={styles.header} component="h1">
        {titleProperty ? get(features[0], titleProperty) : title}
      </Typography>
      <div className={styles.content}>
        {features &&
          features?.map(feature => {
            let properties = { ...feature };
            if (propertiesToOmit || titleProperty)
              properties = omit(properties, [
                ...(Boolean(propertiesToOmit) ? propertiesToOmit : []),
                ...(titleProperty ? [titleProperty] : []),
              ]);
            if (propertiesToPick)
              properties = pick(properties, propertiesToPick);
            return (
              <List key={feature?.pk} className={styles.list}>
                {mapObject(properties, labelMapping, dateFormat)}
                {postFeatureComponent ? postFeatureComponent(feature) : null}
                {footer && (
                  <Item jsonKey={footer.label} value={footer.content} />
                )}
              </List>
            );
          })}
        {children && children}
      </div>
    </>
  );
};

export default FeatureDetail;
