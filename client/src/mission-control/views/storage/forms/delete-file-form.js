import React from 'react';

import { Button, Grid, Link, Typography } from '@astrosat/astrosat-ui';

import { Form } from 'components';

export const DeleteFileForm = ({ onDeleteFileClick, onCancelClick }) => {
  return (
    <Grid>
      <Form.Row component={Typography}>
        Do you want to permanently delete the file? If yes, we will archive it
        for you for 30 days if you change your mind in the meantime and delete
        it permanently afterwards.
      </Form.Row>
      <Form.Row centered>
        <Button onClick={onDeleteFileClick}>Yes</Button>
      </Form.Row>
      <Form.Row centered>
        <Link component="button" onClick={onCancelClick}>
          Cancel
        </Link>
      </Form.Row>
    </Grid>
  );
};
