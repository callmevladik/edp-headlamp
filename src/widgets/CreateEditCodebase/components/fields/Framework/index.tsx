import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CODEBASE_COMMON_LANGUAGES } from '../../../../../configs/codebase-mappings';
import { CodebaseMappingItemInterface } from '../../../../../configs/codebase-mappings/types';
import { UseSpriteSymbol } from '../../../../../icons/UseSpriteSymbol';
import { FormRadioGroup } from '../../../../../providers/Form/components/FormRadioGroup';
import { FormRadioOption } from '../../../../../providers/Form/components/FormRadioGroup/types';
import { FormTextField } from '../../../../../providers/Form/components/FormTextField';
import { getCodebaseMappingByCodebaseType } from '../../../../../utils/getCodebaseMappingByCodebaseType';
import { CODEBASE_FORM_NAMES } from '../../../names';
import { CreateCodebaseFormValues } from '../../Create/types';

export const Framework = () => {
    const {
        register,
        control,
        formState: { errors },
        watch,
    } = useFormContext<CreateCodebaseFormValues>();

    const langFieldValue = watch(CODEBASE_FORM_NAMES.lang.name);
    const typeFieldValue = watch(CODEBASE_FORM_NAMES.type.name);

    const codebaseMapping = getCodebaseMappingByCodebaseType(typeFieldValue);

    const chosenLang = codebaseMapping?.[langFieldValue];

    const frameworkOptions = React.useMemo(() => {
        if (!chosenLang) {
            return [];
        }

        const resultOptions: FormRadioOption[] = [];

        for (const framework of Object.values<CodebaseMappingItemInterface>(
            chosenLang.frameworks
        )) {
            const { name, value, icon } = framework;
            resultOptions.push({
                value,
                label: name,
                icon: <UseSpriteSymbol name={icon} width={20} height={20} />,
                checkedIcon: <UseSpriteSymbol name={icon} width={20} height={20} />,
            });
        }

        return resultOptions;
    }, [chosenLang]);

    return (
        <>
            {langFieldValue === CODEBASE_COMMON_LANGUAGES.OTHER ? (
                <FormTextField
                    {...register(CODEBASE_FORM_NAMES.framework.name, {
                        required: `Enter ${typeFieldValue} language version/framework`,
                        maxLength: {
                            value: 8,
                            message: 'You exceeded the maximum length of 8',
                        },
                        pattern: {
                            value: /[a-z]/,
                            message: 'Invalid language version/framework name: [a-z]',
                        },
                    })}
                    label={`Language version/framework`}
                    title={
                        'Indicate the version of the programming language or framework your component relies on. '
                    }
                    placeholder={`Enter language version/framework`}
                    control={control}
                    errors={errors}
                />
            ) : (
                <FormRadioGroup
                    {...register(CODEBASE_FORM_NAMES.framework.name, {
                        required: `Select ${typeFieldValue} language version/framework`,
                    })}
                    control={control}
                    errors={errors}
                    label={`Language version/framework`}
                    title={
                        'Indicate the version of the programming language or framework your component relies on. '
                    }
                    options={frameworkOptions}
                />
            )}
        </>
    );
};
