import * as React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

/**
 *
 * @param {{
 *   onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
 * } & any} props
 */
const Form = props => (
  <Grid container spacing={2} component="form" noValidate {...props} />
);

const Row = ({ centered = false, ...rest }) => (
  <Grid
    item
    xs={12}
    {...(centered ? { container: true, justifyContent: 'center' } : {})}
    {...rest}
  />
);

Form.Row = Row;

export default Form;
