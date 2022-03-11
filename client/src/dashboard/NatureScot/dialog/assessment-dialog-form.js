import React from 'react';

import { makeStyles, Grid } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({}));

const AssessmentDialogForm = props => {
  const styles = useStyles();

  return <Grid container spacing={2} component="form" {...props} />;
};

const Row = ({ centered = false, ...rest }) => (
  <Grid
    item
    xs={12}
    {...(centered ? { container: true, justifyContent: 'center' } : {})}
    {...rest}
  />
);

AssessmentDialogForm.Row = Row;

export default AssessmentDialogForm;
