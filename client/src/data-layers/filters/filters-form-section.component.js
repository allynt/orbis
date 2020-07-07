import React from 'react';
import { toTitleCase } from 'utils/text';
import styles from './filters-form-section.module.css';
import { filterValueIsPresent } from './filters-utils';
import { Checkbox } from '@astrosat/astrosat-ui';

export const FiltersFormSection = ({
  layer,
  property,
  options,
  currentFilters,
  onCheckboxChange,
}) => {
  let propertyLabel = property.split('.');
  propertyLabel = propertyLabel[propertyLabel.length - 1];
  return (
    <fieldset>
      <div className={styles.property}>
        <legend>{toTitleCase(propertyLabel)} :</legend>
        <div className={styles.options}>
          {options.map(value => {
            const defaultChecked = filterValueIsPresent(currentFilters, {
              layer,
              property,
              value,
            });
            return (
              <div className={styles.option}>
                <Checkbox
                  key={`${layer}.${property}.${value}`}
                  label={toTitleCase(value)}
                  ariaLabel={value}
                  defaultChecked={defaultChecked}
                  onChange={onCheckboxChange({ layer, property, value })}
                />
              </div>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
};
