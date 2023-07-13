import { EditorDialog } from '@kinvolk/headlamp-plugin/lib/components/common';
import { KubeObjectInterface } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { Button, Divider, Grid } from '@material-ui/core';
import { omit } from 'lodash';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    Description,
    GroovyPipelineLibrary,
    JobProvisioner,
    QualityGates,
    StageName,
    TriggerType,
} from '../../../../components/FormFields/CDPipelineStageFields';
import { Cluster } from '../../../../components/FormFields/CDPipelineStageFields/Cluster';
import { Render } from '../../../../components/Render';
import { CI_TOOLS } from '../../../../constants/ciTools';
import { useHandleEditorSave } from '../../../../hooks/useHandleEditorSave';
import { EDPCDPipelineStageKubeObjectInterface } from '../../../../k8s/EDPCDPipelineStage/types';
import { EDPCodebaseBranchKubeObjectInterface } from '../../../../k8s/EDPCodebaseBranch/types';
import { useDefaultCIToolQuery } from '../../../../k8s/EDPComponent/hooks/useDefaultCIToolQuery';
import { FieldEventTarget } from '../../../../types/forms';
import { DeepPartial } from '../../../../types/global';
import { rem } from '../../../../utils/styling/rem';
import { useDefaultValues } from './hooks/useDefaultValues';
import { useEditorCode } from './hooks/useEditorCode';
import { CDPIPELINE_STAGE_BACKWARDS_NAME_MAPPING, CDPIPELINE_STAGE_NAMES } from './names';
import { useStyles } from './styles';
import { CreateCDPipelineStageFormProps } from './types';

export const CreateCDPipelineStageForm = ({
    CDPipelineData,
    otherStages,
    editorOpen,
    setEditorOpen,
    handleApply,
    setDialogOpen,
    isApplying,
}: CreateCDPipelineStageFormProps) => {
    const classes = useStyles();

    const { baseDefaultValues } = useDefaultValues({
        names: CDPIPELINE_STAGE_NAMES,
        stagesQuantity: otherStages.length,
    });

    const [formValues, setFormValues] =
        React.useState<DeepPartial<EDPCDPipelineStageKubeObjectInterface>>(baseDefaultValues);

    const methods = useForm({
        mode: 'onChange',
        defaultValues: baseDefaultValues,
    });

    const {
        handleSubmit,
        reset,
        resetField,
        formState: { isDirty, isValid },
        setValue,
        watch,
    } = methods;

    const handleFormFieldChange = React.useCallback(({ name, value }: FieldEventTarget) => {
        setFormValues(prev => {
            if (Object.hasOwn(CDPIPELINE_STAGE_NAMES[name], 'notUsedInFormData')) {
                return prev;
            }

            if (value === undefined) {
                return omit(prev, name);
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    }, []);

    const handleResetFields = React.useCallback(() => {
        setFormValues(baseDefaultValues);
        reset();
    }, [baseDefaultValues, reset]);

    const { handleEditorSave } = useHandleEditorSave({
        names: CDPIPELINE_STAGE_NAMES,
        backwardNames: CDPIPELINE_STAGE_BACKWARDS_NAME_MAPPING,
        setValue,
        handleFormFieldChange,
        formValues,
        resetField,
    });

    const { editorReturnValues } = useEditorCode({
        names: CDPIPELINE_STAGE_NAMES,
        formValues,
        CDPipelineData,
    });

    const onEditorSave = React.useCallback(
        (editorReturnValues: EDPCodebaseBranchKubeObjectInterface) => {
            handleEditorSave(editorReturnValues);
            setEditorOpen(false);
        },
        [handleEditorSave, setEditorOpen]
    );

    const onSubmit = React.useCallback(() => {
        handleApply({
            CDPipelineStageData: editorReturnValues,
        });
    }, [editorReturnValues, handleApply]);

    const { data: defaultCITool } = useDefaultCIToolQuery();

    const qualityGatesFieldValue = watch(CDPIPELINE_STAGE_NAMES.qualityGates.name);

    const otherStagesNames = React.useMemo(
        () => otherStages.map(({ spec: { name } }) => name),
        [otherStages]
    );

    return (
        <FormProvider {...methods}>
            <div className={classes.form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.formInner}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Cluster
                                    names={CDPIPELINE_STAGE_NAMES}
                                    handleFormFieldChange={handleFormFieldChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <StageName
                                    names={CDPIPELINE_STAGE_NAMES}
                                    handleFormFieldChange={handleFormFieldChange}
                                    otherStagesNames={otherStagesNames}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Description
                                    names={CDPIPELINE_STAGE_NAMES}
                                    handleFormFieldChange={handleFormFieldChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TriggerType
                                    names={CDPIPELINE_STAGE_NAMES}
                                    handleFormFieldChange={handleFormFieldChange}
                                />
                            </Grid>
                            <Render condition={defaultCITool && defaultCITool === CI_TOOLS.JENKINS}>
                                <>
                                    <Grid item xs={6}>
                                        <JobProvisioner
                                            names={CDPIPELINE_STAGE_NAMES}
                                            handleFormFieldChange={handleFormFieldChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <GroovyPipelineLibrary
                                            names={CDPIPELINE_STAGE_NAMES}
                                            handleFormFieldChange={handleFormFieldChange}
                                        />
                                    </Grid>
                                </>
                            </Render>
                            <Grid item xs={12}>
                                <Divider
                                    style={{
                                        margin: `${rem(20)} auto`,
                                        width: '100%',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <QualityGates
                                    names={CDPIPELINE_STAGE_NAMES}
                                    handleFormFieldChange={handleFormFieldChange}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.actions}>
                        <Button
                            onClick={handleResetFields}
                            size="small"
                            component={'button'}
                            disabled={!isDirty}
                        >
                            undo changes
                        </Button>
                        <Button
                            onClick={() => setDialogOpen(false)}
                            size="small"
                            component={'button'}
                            style={{ marginLeft: 'auto' }}
                        >
                            cancel
                        </Button>
                        <Button
                            type={'submit'}
                            variant={'contained'}
                            color={'primary'}
                            size="small"
                            disabled={
                                !isValid ||
                                isApplying ||
                                !qualityGatesFieldValue ||
                                !qualityGatesFieldValue.length
                            }
                        >
                            apply
                        </Button>
                    </div>
                </form>
            </div>
            <Render condition={!!editorOpen}>
                <EditorDialog
                    open={editorOpen}
                    item={editorReturnValues as unknown as KubeObjectInterface}
                    onClose={() => setEditorOpen(false)}
                    onSave={onEditorSave}
                />
            </Render>
        </FormProvider>
    );
};