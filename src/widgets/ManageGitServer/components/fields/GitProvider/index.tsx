import React from 'react';
import { useFormContext as useReactHookFormContext } from 'react-hook-form';
import { GIT_PROVIDER_ICON_MAPPING } from '../../../../../configs/icon-mappings';
import { gitProviderOptions } from '../../../../../configs/select-options/gitProviders';
import { GIT_PROVIDERS } from '../../../../../constants/gitProviders';
import { Resources } from '../../../../../icons/sprites/Resources';
import { RESOURCE_ICON_NAMES } from '../../../../../icons/sprites/Resources/names';
import { UseSpriteSymbol } from '../../../../../icons/UseSpriteSymbol';
import { FormRadioGroup } from '../../../../../providers/Form/components/FormRadioGroup';
import { useFormContext } from '../../../../../providers/Form/hooks';
import { FieldEvent, FORM_MODES } from '../../../../../types/forms';
import { GIT_SERVER_FORM_NAMES } from '../../../names';
import { ManageGitServerDataContext, ManageGitServerValues } from '../../../types';

export const GitProvider = () => {
    const {
        register,
        control,
        formState: { errors, dirtyFields },
        setValue,
    } = useReactHookFormContext<ManageGitServerValues>();

    const {
        formData: { mode },
    } = useFormContext<ManageGitServerDataContext>();

    return (
        <>
            <Resources />
            <FormRadioGroup
                {...register(GIT_SERVER_FORM_NAMES.gitProvider.name, {
                    required: 'Select your Git provider.',
                    onChange: ({ target: { value } }: FieldEvent) => {
                        if (dirtyFields?.gitUser) {
                            return value;
                        }

                        switch (value) {
                            case GIT_PROVIDERS.GERRIT:
                                setValue(GIT_SERVER_FORM_NAMES.gitUser.name, 'edp-ci');
                                break;
                            case GIT_PROVIDERS.GITHUB:
                                setValue(GIT_SERVER_FORM_NAMES.gitUser.name, 'git');
                                break;
                            case GIT_PROVIDERS.GITLAB:
                                setValue(GIT_SERVER_FORM_NAMES.gitUser.name, 'git');
                                break;
                        }
                    },
                })}
                control={control}
                errors={errors}
                label={'Git provider'}
                title={'Select your Git provider.'}
                options={gitProviderOptions.map(({ label, value }) => {
                    return {
                        value,
                        label,
                        icon: (
                            <UseSpriteSymbol
                                name={
                                    GIT_PROVIDER_ICON_MAPPING?.[value] || RESOURCE_ICON_NAMES.OTHER
                                }
                                width={20}
                                height={20}
                            />
                        ),
                        checkedIcon: (
                            <UseSpriteSymbol
                                name={
                                    GIT_PROVIDER_ICON_MAPPING?.[value] || RESOURCE_ICON_NAMES.OTHER
                                }
                                width={20}
                                height={20}
                            />
                        ),
                    };
                })}
                disabled={mode === FORM_MODES.EDIT}
            />
        </>
    );
};
