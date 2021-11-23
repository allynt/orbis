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

const SelectScreen = ({ onDoneClick, onNextClick }) => {
  const [selected, setSelected] = useState(undefined);
  // console.log('selected: ', selected);
  return (
    <Wrapper>
      <Grid
        item
        container
        component={Select}
        value={selected}
        onChange={e => {
          console.log('e: ', e);
          setSelected(e.target.value);
        }}
      >
        {Object.entries(targetSelectOptions).map(([key, value]) => (
          <MenuItem key={key}>{value}</MenuItem>
        ))}
      </Grid>
      <Grid item container justifyContent="space-evenly">
        <Button color="secondary" onClick={onDoneClick}>
          Done
        </Button>
        <Button disabled={!selected} onClick={onNextClick}>
          Next
        </Button>
      </Grid>
    </Wrapper>
  );
};

const TargetScreen = ({ fields, onAddTargetClick }) => {
  // will have to be form

  const onResetClick = () => {};
  const disabled = false;
  return (
    <Grid item container wrap="wrap">
      {fields.map(field => (
        <Input key={field} placeholder={`${field}`} />
      ))}
      <Grid item container>
        <Button color="secondary" onClick={onResetClick}>
          Reset
        </Button>
        <Button disabled={disabled} onClick={onAddTargetClick}>
          Add Target
        </Button>
      </Grid>
    </Grid>
  );
};

export { SelectScreen, TargetScreen };
