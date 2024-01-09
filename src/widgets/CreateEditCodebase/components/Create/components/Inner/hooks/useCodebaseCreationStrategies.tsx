import { Icon } from '@iconify/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CODEBASE_TYPES } from '../../../../../../../constants/codebaseTypes';
import { CODEBASE_FORM_NAMES } from '../../../../../names';
import { CreateCodebaseFormValues } from '../../../types';

export const useCodebaseCreationStrategies = () => {
  const { watch } = useFormContext<CreateCodebaseFormValues>();
  const typeFieldValue = watch(CODEBASE_FORM_NAMES.type.name);

  return React.useMemo(
    () => [
      {
        value: 'create',
        label: 'Create from template',
        description: 'Create a sample project from a template to start quickly.',
        icon: (
          <Icon
            icon={'material-symbols:create-new-folder-outline-rounded'}
            width={40}
            height={40}
          />
        ),
        checkedIcon: (
          <Icon
            icon={'material-symbols:create-new-folder-outline-rounded'}
            width={40}
            height={40}
          />
        ),
        disabled: !typeFieldValue || typeFieldValue === CODEBASE_TYPES.AUTOTEST,
      },
      {
        value: 'clone',
        label: 'Clone project',
        description: 'Clone code from third-party VCS providers.',
        icon: <Icon icon={'clarity:clone-line'} width={40} height={40} />,
        checkedIcon: <Icon icon={'clarity:clone-line'} width={40} height={40} />,
        disabled: !typeFieldValue,
      },
      {
        value: 'import',
        label: 'Import project',
        description: 'Onboard your existing code to the EDP platform.',
        icon: <Icon icon={'carbon:document-import'} width={40} height={40} />,
        checkedIcon: <Icon icon={'carbon:document-import'} width={40} height={40} />,
        disabled: !typeFieldValue,
      },
    ],
    [typeFieldValue]
  );
};
