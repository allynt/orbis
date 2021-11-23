import React, { useState } from 'react';

import {
  Grid,
  makeStyles,
  Select,
  MenuItem,
  Button,
  Input,
} from '@astrosat/astrosat-ui';

import { targetSelectOptions } from './waltham.constants';

const useStyles = makeStyles(() => ({
  wrapper: {
    minHeight: '20rem',
    minWidth: '40rem',
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
  const [selectedDataset, setSelectedDataset] = useState(
    'Select Type of Target',
  );
  return (
    <Wrapper>
      <Grid
        item
        container
        component={Select}
        value={selectedDataset}
        inputProps={{ 'aria-label': 'Dataset' }}
        onChange={e => setSelectedDataset(e.target.value)}
      >
        {Object.entries(targetSelectOptions).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Grid>
      <Grid item container justifyContent="space-evenly">
        <Button
          disabled={!selectedDataset}
          onClick={() => onNextClick(selectedDataset)}
        >
          Next
        </Button>
      </Grid>
    </Wrapper>
  );
};

const TargetScreen = ({ datasetName, fields, onAddTargetsClick }) => {
  // will have to be form
  const targets = {
    datasetName: {
      '2016 - 2017': 10,
      '2017 - 2018': 20,
      '2018 - 2019': 30,
    },
  };
  const onResetClick = () => {};
  const disabled = false;
  return (
    <Grid item container wrap="wrap">
      {fields?.map(field => (
        <Input key={field} placeholder={`${field}`} />
      ))}
      <Grid item container>
        <Button color="secondary" onClick={onResetClick}>
          Reset
        </Button>
        <Button disabled={disabled} onClick={() => onAddTargetsClick(targets)}>
          Add Target
        </Button>
      </Grid>
    </Grid>
  );
};

export { SelectScreen, TargetScreen };
