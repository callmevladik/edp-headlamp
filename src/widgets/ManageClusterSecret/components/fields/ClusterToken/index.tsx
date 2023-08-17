import { Grid } from '@material-ui/core';
import React from 'react';
import { useFormContext as useReactHookFormContext } from 'react-hook-form';
import { FormTextField } from '../../../../../providers/Form/components/FormTextField';
import { useFormContext } from '../../../../../providers/Form/hooks';
import { CLUSTER_CREATION_FORM_NAMES } from '../../../names';
import { ManageClusterSecretDataContext, ManageClusterSecretValues } from '../../../types';

export const ClusterToken = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useReactHookFormContext<ManageClusterSecretValues>();

    const {
        formData: { isReadOnly },
    } = useFormContext<ManageClusterSecretDataContext>();

    return (
        <Grid item xs={12}>
            <FormTextField
                {...register(CLUSTER_CREATION_FORM_NAMES.clusterToken.name, {
                    required: 'Enter cluster token',
                })}
                label={'Cluster Token'}
                placeholder={'Enter cluster token'}
                control={control}
                errors={errors}
                disabled={isReadOnly}
                InputProps={{
                    type: 'password',
                }}
            />
        </Grid>
    );
};