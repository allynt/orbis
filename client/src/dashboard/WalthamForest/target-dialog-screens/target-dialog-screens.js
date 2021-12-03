import React, { useState, useEffect } from 'react';

import {
  Grid,
  makeStyles,
  Select,
  MenuItem,
  Button,
  Input,
} from '@astrosat/astrosat-ui';

import { targetInputFields, targetDatasets } from '../waltham.constants';
import { validate } from './validate';

const useStyles = makeStyles(theme => ({
  wrapper: {
    minHeight: '20rem',
    minWidth: '40rem',
  },
  buttons: {
    marginTop: '2.5rem',
    gap: '1rem',
  },
  inputFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '1rem',
  },
  error: {
    color: theme.palette.error.main,
    width: '100%',
    textAlign: 'center',
  },
}));

const DEFAULT_TEXT = 'Select Type of Target';

const Wrapper = ({ children }) => {
  const styles = useStyles({});
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      className={styles.wrapper}
    >
      {children}
    </Grid>
  );
};

/**
 * @param {{
 *  onNextClick: (dataset: string) => void
 * }} props
 */
const SelectScreen = ({ onNextClick }) => {
  const styles = useStyles({});
  const [selectedDataset, setSelectedDataset] = useState(DEFAULT_TEXT);
  return (
    <Wrapper>
      <Grid
        item
        container
        component={Select}
        value={selectedDataset}
        inputProps={{ 'aria-label': 'Waltham Forest datasets' }}
        onChange={({ target: { value } }) => setSelectedDataset(value)}
      >
        <MenuItem value={DEFAULT_TEXT} disabled>
          {DEFAULT_TEXT}
        </MenuItem>
        {Object.entries(targetDatasets).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Grid>
      <Grid item container justifyContent="flex-end" className={styles.buttons}>
        <Button
          disabled={selectedDataset === DEFAULT_TEXT}
          onClick={() => onNextClick(selectedDataset)}
        >
          Next
        </Button>
      </Grid>
    </Wrapper>
  );
};

/**
 * @param {{
 *  onAddTargetsClick: (targets: object) => void
 * }} props
 */
const TargetScreen = ({ onAddTargetsClick }) => {
  const styles = useStyles({});
  const [targetData, setTargetData] = useState({});
  const [error, setError] = useState(undefined);
  const isDirty = Object.values(targetData).some(v => !!v);

  useEffect(() => {
    if (Object.keys(targetData).length) {
      setError(validate(targetData));
    }
  }, [targetData]);

  const handleChange = (field, value) =>
    setTargetData({ ...targetData, [field]: value.trim() });

  return (
    <Grid
      item
      container
      component="form"
      onSubmit={() => onAddTargetsClick(targetData)}
    >
      {!!error ? <span className={styles.error}>{error}</span> : null}
      <Grid item container className={styles.inputFields}>
        {targetInputFields?.map(field => (
          <Input
            key={field}
            value={targetData[field] ?? ''}
            placeholder={field}
            onChange={({ target: { value } }) => handleChange(field, value)}
          />
        ))}
      </Grid>
      <Grid item container justifyContent="flex-end" className={styles.buttons}>
        <Button color="secondary" onClick={() => setTargetData({})}>
          Reset
        </Button>
        <Button disabled={!isDirty || !!error} type="submit">
          Add Target
        </Button>
      </Grid>
    </Grid>
  );
};

export { SelectScreen, TargetScreen };
