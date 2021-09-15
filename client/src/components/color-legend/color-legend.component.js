import * as React from 'react';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
} from '@astrosat/astrosat-ui';

import { InfoButtonTooltip } from 'components';

/**
 * @param {{categories: {[category: string]: {color?: string, description?: string}}}} props
 */
export const ColorLegend = ({ categories }) => (
  <List>
    {Object.entries(categories).map(([category, { color, description }]) => {
      const ariaLabel = { 'aria-label': category };
      const ariaLabelProp = !description
        ? ariaLabel
        : { ContainerProps: ariaLabel };

      return (
        <ListItem key={category} {...ariaLabelProp}>
          <ListItemIcon>
            {color ? (
              <span
                role="presentation"
                style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  backgroundColor: color,
                }}
              />
            ) : null}
          </ListItemIcon>
          <ListItemText primary={category} />
          {description ? (
            <ListItemSecondaryAction>
              <InfoButtonTooltip tooltipContent={description} />
            </ListItemSecondaryAction>
          ) : null}
        </ListItem>
      );
    })}
  </List>
);
