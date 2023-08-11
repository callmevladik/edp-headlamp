import { Grid } from '@material-ui/core';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormTextField } from '../../../../../providers/Form/components/FormTextField';
import { CLUSTER_CREATION_FORM_NAMES } from '../../../names';
import { CreateClusterFormValues } from '../../../types';

export const ClusterToken = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<CreateClusterFormValues>();

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
            />
        </Grid>
    );
};