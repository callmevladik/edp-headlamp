import React from 'react';
import { EDPCodebaseKubeObjectInterface } from '../../../../../k8s/EDPCodebase/types';
import { editCodebaseInstance } from '../../../../../k8s/EDPCodebase/utils/editCodebaseInstance';
import { FormNameObject } from '../../../../../types/forms';
import { DeepPartial } from '../../../../../types/global';

interface UseEditorCodeProps {
    names: { [key: string]: FormNameObject };
    formValues: {
        [key: string]: any;
    };
    kubeObjectData: DeepPartial<EDPCodebaseKubeObjectInterface>;
}

export const useEditorCode = ({
    names,
    formValues,
    kubeObjectData,
}: UseEditorCodeProps): { editorReturnValues: EDPCodebaseKubeObjectInterface } => {
    const editorReturnValues = React.useMemo(() => {
        return editCodebaseInstance(
            names,
            kubeObjectData,
            formValues
        ) as EDPCodebaseKubeObjectInterface;
    }, [formValues, kubeObjectData, names]);

    return { editorReturnValues };
};