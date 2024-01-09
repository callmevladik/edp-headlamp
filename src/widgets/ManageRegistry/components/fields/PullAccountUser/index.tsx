import React from 'react';
import { useFormContext as useReactHookFormContext } from 'react-hook-form';
import { FormTextField } from '../../../../../providers/Form/components/FormTextField';
import { useFormContext } from '../../../../../providers/Form/hooks';
import { REGISTRY_NAMES } from '../../../names';
import { ManageRegistryDataContext } from '../../../types';

export const PullAccountUser = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useReactHookFormContext();

  const {
    formData: { pullAccountSecret },
  } = useFormContext<ManageRegistryDataContext>();

  const hasOwnerReference = !!pullAccountSecret?.metadata?.ownerReferences;

  return (
    <FormTextField
      {...register(REGISTRY_NAMES.PULL_ACCOUNT_USER, {
        required: 'Enter user name',
      })}
      label={`User`}
      title={'Provide the unique identifier linked to your user account on the container registry.'}
      placeholder={'Enter user name'}
      control={control}
      errors={errors}
      disabled={hasOwnerReference}
    />
  );
};
