import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useGitServerListQuery } from '../../../../../k8s/EDPGitServer/hooks/useGitServerListQuery';
import { FormSelect } from '../../../../../providers/Form/components/FormSelect';
import { CODEBASE_FROM_TEMPLATE_FORM_NAMES } from '../../../names';
import { CreateCodebaseFromTemplateFormValues } from '../../../types';

export const GitServer = () => {
  const { data: gitServers } = useGitServerListQuery({});
  const gitServersOptions = React.useMemo(
    () => gitServers?.items.map(({ metadata: { name } }) => ({ label: name, value: name })),
    [gitServers?.items]
  );

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateCodebaseFromTemplateFormValues>();

  return (
    <FormSelect
      {...register(CODEBASE_FROM_TEMPLATE_FORM_NAMES.gitServer.name, {
        required: 'Select an existing Git server.',
      })}
      label={'Git server'}
      title={'Choose the Git server for hosting your repository.'}
      control={control}
      errors={errors}
      options={gitServersOptions}
    />
  );
};
