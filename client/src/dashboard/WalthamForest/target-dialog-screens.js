import React, { useState } from 'react';

import {
  Grid,
  makeStyles,
  Select,
  MenuItem,
  Button,
  Input,
} from '@astrosat/astrosat-ui';

import { targetInputFields, targetDatasets } from './waltham.constants';

const useStyles = makeStyles(() => ({
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
}));

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

const SelectScreen = ({ onNextClick }) => {
  const styles = useStyles({});

  // TODO: need to deal with placeholder
  const defaultText = 'This is a placeholder';
  const [selectedDataset, setSelectedDataset] = useState(defaultText);
  return (
    <Wrapper>
      <Grid
        item
        container
        component={Select}
        value={selectedDataset}
        inputProps={{ 'aria-label': 'Dataset' }}
        onChange={({ target: { value } }) => setSelectedDataset(value)}
      >
        {Object.entries(targetDatasets).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Grid>
      <Grid item container justifyContent="flex-end" className={styles.buttons}>
        <Button
          disabled={selectedDataset === defaultText}
          onClick={() => onNextClick(selectedDataset)}
        >
          Next
        </Button>
      </Grid>
    </Wrapper>
  );
};

// TODO: filter out empty string values
const TargetScreen = ({ onAddTargetsClick }) => {
  const styles = useStyles({});
  const [targetData, setTargetData] = useState({});
  const isDirty = Object.values(targetData).some(v => !!v);
  return (
    <Grid
      item
      container
      component="form"
      onSubmit={() => onAddTargetsClick(targetData)}
    >
      <Grid item container className={styles.inputFields}>
        {targetInputFields?.map(field => (
          <Input
            key={field}
            value={targetData[field] ?? ''}
            placeholder={field}
            onChange={({ target: { value } }) =>
              setTargetData({ ...targetData, [field]: value })
            }
          />
        ))}
      </Grid>
      <Grid item container justifyContent="flex-end" className={styles.buttons}>
        <Button color="secondary" onClick={() => setTargetData({})}>
          Reset
        </Button>
        <Button disabled={!isDirty} type="submit">
          Add Target
        </Button>
      </Grid>
    </Grid>
  );
};

export { SelectScreen, TargetScreen };
