import React from 'react';
import { useFormContext as useReactHookFormContext } from 'react-hook-form';
import { FormTextFieldPassword } from '../../../../../providers/Form/components/FormTextFieldPassword';
import { useFormContext } from '../../../../../providers/Form/hooks';
import { FORM_MODES } from '../../../../../types/forms';
import { SSO_INTEGRATION_SECRET_FORM_NAMES } from '../../../names';
import { ManageSSOIntegrationSecretFormDataContext } from '../../../types';

export const Password = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useReactHookFormContext();

    const {
        formData: { mode, isReadOnly },
    } = useFormContext<ManageSSOIntegrationSecretFormDataContext>();

    return (
        <FormTextFieldPassword
            {...register(SSO_INTEGRATION_SECRET_FORM_NAMES.password.name, {
                required: 'Enter your Keycloak SSO password.',
            })}
            label={'Password'}
            title={'Provide the password associated with your Keycloak SSO account.'}
            placeholder={'Enter password'}
            control={control}
            errors={errors}
            disabled={mode === FORM_MODES.EDIT && isReadOnly}
        />
    );
};
