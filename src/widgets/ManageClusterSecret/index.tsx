import { Grid } from '@material-ui/core';
import React from 'react';
import { FORM_MODES } from '../../types/forms';
import { Create } from './components/Create';
import { Edit } from './components/Edit';
import { ManageClusterSecretProps } from './types';

export const ManageClusterSecret = ({ formData }: ManageClusterSecretProps) => {
    const { mode } = formData;

    return (
        <Grid container spacing={2} data-testid="form">
            <Grid item xs={12}>
                {mode === FORM_MODES.CREATE && <Create formData={formData} />}
                {mode === FORM_MODES.EDIT && <Edit formData={formData} />}
            </Grid>
        </Grid>
    );
};
