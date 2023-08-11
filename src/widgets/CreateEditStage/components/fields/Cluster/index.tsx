import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DEFAULT_CLUSTER } from '../../../../../constants/clusters';
import { useClusterSecretListQuery } from '../../../../../k8s/Secret/hooks/useClusterSecretListQuery';
import { FormSelect } from '../../../../../providers/Form/components/FormSelect';
import { STAGE_FORM_NAMES } from '../../../names';
import { CreateEditStageFormValues } from '../../../types';

const defaultClusterOption = {
    label: DEFAULT_CLUSTER,
    value: DEFAULT_CLUSTER,
};

export const Cluster = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<CreateEditStageFormValues>();

    const { data, isLoading } = useClusterSecretListQuery({});

    const clusterOptions = React.useMemo(() => {
        if (isLoading || !data) {
            return [defaultClusterOption];
        }
        const clusters = data?.items.map(({ data: { name } }) => {
            const decodedName = atob(unescape(name));
            return {
                label: decodedName,
                value: decodedName,
            };
        });

        return [defaultClusterOption, ...clusters];
    }, [data, isLoading]);

    return (
        <FormSelect
            {...register(STAGE_FORM_NAMES.cluster.name, {
                required: 'Select cluster',
            })}
            label={'Cluster'}
            placeholder={'Select cluster'}
            control={control}
            errors={errors}
            options={clusterOptions}
        />
    );
};