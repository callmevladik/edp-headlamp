import { Grid } from '@material-ui/core';
import React from 'react';
import { useFormContext as useReactHookFormContext } from 'react-hook-form';
import { FormTextField } from '../../../../../providers/Form/components/FormTextField';
import { useFormContext } from '../../../../../providers/Form/hooks';
import { FORM_MODES } from '../../../../../types/forms';
import { CLUSTER_CREATION_FORM_NAMES } from '../../../names';
import { ManageClusterSecretDataContext, ManageClusterSecretValues } from '../../../types';

export const ClusterName = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useReactHookFormContext<ManageClusterSecretValues>();

    const {
        formData: { currentElement },
    } = useFormContext<ManageClusterSecretDataContext>();

    const isPlaceholder = typeof currentElement === 'string' && currentElement === 'placeholder';
    const mode = isPlaceholder ? FORM_MODES.CREATE : FORM_MODES.EDIT;

    return (
        <Grid item xs={12}>
            <FormTextField
                {...register(CLUSTER_CREATION_FORM_NAMES.clusterName.name, {
                    required: 'Enter cluster name',
                })}
                label={'Cluster Name'}
                placeholder={'Enter cluster name'}
                control={control}
                errors={errors}
                disabled={mode === FORM_MODES.EDIT}
            />
        </Grid>
    );
};
