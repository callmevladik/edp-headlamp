import { Grid } from '@mui/material';
import { Alert } from '@mui/material';
import React from 'react';
import { useFormContext } from '../../../../../../providers/Form/hooks';
import { ManageDependencyTrackIntegrationSecretFormDataContext } from '../../../../types';
import { Token, URL } from '../../../fields';

export const Form = () => {
  const {
    formData: { ownerReference },
  } = useFormContext<ManageDependencyTrackIntegrationSecretFormDataContext>();

  return (
    <Grid container spacing={2}>
      {ownerReference && (
        <Grid item xs={12}>
          <Alert severity="info" variant="outlined">
            Managed by {ownerReference}
          </Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <URL />
      </Grid>
      <Grid item xs={12}>
        <Token />
      </Grid>
    </Grid>
  );
};
