import type { DialogProps } from '@material-ui/core/Dialog';
import lodashOmit from 'lodash.omit';
import { FormProvider, useForm } from 'react-hook-form';
import { EDPCodebaseKubeObjectInterface } from '../../../../k8s/EDPCodebase/types';
import { MuiCore, pluginLib, React } from '../../../../plugin.globals';
import { DeepPartial } from '../../../../types/global';
import { capitalizeFirstLetter } from '../../../../utils/format/capitalizeFirstLetter';
import { Render } from '../../../Render';
import {
    CODEBASE_TYPE_APPLICATION,
    CODEBASE_TYPE_AUTOTEST,
    CODEBASE_TYPE_LIBRARY,
    FORM_PART_ADVANCED_SETTINGS,
    FORM_PART_CODEBASE_INFO,
    FORM_PART_CODEBASE_TYPE_INFO,
} from '../../constants';
import { ApplicationAdvancedSettingsFormPart } from './components/ApplicationAdvancedSettingsFormPart';
import { ApplicationCodebaseInfoFormPart } from './components/ApplicationCodebaseInfoFormPart';
import { ApplicationCodebaseTypeInfoFormPart } from './components/ApplicationCodebaseTypeInfoFormPart';
import { AutotestAdvancedSettingsFormPart } from './components/AutotestAdvancedSettingsFormPart';
import { AutotestCodebaseInfoFormPart } from './components/AutotestCodebaseInfoFormPart';
import { AutotestCodebaseTypeInfoFormPart } from './components/AutotestCodebaseTypeInfoFormPart';
import { LibraryAdvancedSettingsFormPart } from './components/LibraryAdvancedSettingsFormPart';
import { LibraryCodebaseInfoFormPart } from './components/LibraryCodebaseInfoFormPart';
import { LibraryCodebaseTypeInfoFormPart } from './components/LibraryCodebaseTypeInfoFormPart';
import { TabPanel } from './components/TabPanel';
import { TAB_INDEXES } from './constants';
import { useDefaultValues } from './hooks/useDefaultValues';
import { useEditorCode } from './hooks/useEditorCode';
import { useHandleEditorSave } from './hooks/useHandleEditorSave';
import { useNames } from './hooks/useNames';
import { useStyles } from './styles';
import { CreateCodebasenFormProps } from './types';

const { Tabs, Tab, Button } = MuiCore;

const {
    CommonComponents: { EditorDialog },
} = pluginLib;

const a11yProps = (index: any) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const TAB_INDEXES_LAST_INDEX = Object.keys(TAB_INDEXES).length - 1;

export const CreateCodebaseForm = ({
    type,
    editorOpen,
    setEditorOpen,
    handleApply,
    setDialogOpen,
}: CreateCodebasenFormProps): React.ReactElement => {
    const classes = useStyles();

    const [activeTabIdx, setActiveTabIdx] = React.useState<string>(
        TAB_INDEXES[FORM_PART_CODEBASE_INFO]
    );

    const { names } = useNames({ type });
    const { baseDefaultValues } = useDefaultValues({ names, type });

    const [formValues, setFormValues] =
        React.useState<DeepPartial<EDPCodebaseKubeObjectInterface>>(baseDefaultValues);
    const [codebaseAuthData, setCodebaseAuthData] = React.useState<{
        repositoryLogin: string;
        repositoryPasswordOrApiToken: string;
    }>({
        repositoryLogin: '',
        repositoryPasswordOrApiToken: '',
    });

    const handleChangeTab = React.useCallback(
        (event: React.ChangeEvent<{}>, newActiveTabIdx: number) => {
            setActiveTabIdx(newActiveTabIdx);
        },
        []
    );

    const methods = useForm({
        defaultValues: baseDefaultValues,
    });

    const {
        handleSubmit,
        reset,
        resetField,
        formState: { isDirty },
        setValue,
    } = methods;

    const getFirstErrorTabName = React.useCallback(
        errors => {
            const [firstErrorFieldName] = Object.keys(errors);
            return names[firstErrorFieldName].formPart;
        },
        [names]
    );

    const handleFormFieldChange = React.useCallback(
        ({ target: { name, value } }) => {
            setCodebaseAuthData(prev => {
                if (Object.hasOwn(names[name], 'notUsedInFormData') && name === 'repositoryLogin') {
                    return {
                        ...prev,
                        repositoryLogin: value,
                    };
                }

                if (
                    Object.hasOwn(names[name], 'notUsedInFormData') &&
                    name === 'repositoryPasswordOrApiToken'
                ) {
                    return {
                        ...prev,
                        repositoryPasswordOrApiToken: value,
                    };
                }

                return prev;
            });
            setFormValues(prev => {
                if (Object.hasOwn(names[name], 'notUsedInFormData')) {
                    return prev;
                }

                if (value === undefined) {
                    return lodashOmit(prev, name);
                }

                return {
                    ...prev,
                    [name]: value,
                };
            });
        },
        [names]
    );

    const handleResetFields = React.useCallback(() => {
        setFormValues(baseDefaultValues);
        reset();
    }, [baseDefaultValues, reset]);

    const { handleEditorSave } = useHandleEditorSave({
        names,
        setValue,
        handleFormFieldChange,
        formValues,
        resetField,
    });

    const { editorCode } = useEditorCode({ names, formValues, type });

    const onEditorSave = React.useCallback(
        (editorPropsObject: EDPCodebaseKubeObjectInterface) => {
            handleEditorSave(editorPropsObject);
            setEditorOpen(false);
        },
        [handleEditorSave, setEditorOpen]
    );

    const handleValidationError = React.useCallback(
        (errors: Object) => {
            if (errors) {
                const firstErrorTabName = getFirstErrorTabName(errors);
                setActiveTabIdx(TAB_INDEXES[firstErrorTabName]);
            }
        },
        [getFirstErrorTabName]
    );

    const muDialogProps: DialogProps = {
        open: editorOpen,
    };

    const onSubmit = React.useCallback(() => {
        const { repositoryLogin, repositoryPasswordOrApiToken } = codebaseAuthData;

        if (repositoryLogin && repositoryPasswordOrApiToken) {
            handleApply(editorCode, codebaseAuthData);
        } else {
            handleApply(editorCode, null);
        }
    }, [codebaseAuthData, editorCode, handleApply]);

    return (
        <FormProvider {...methods}>
            <Tabs
                orientation="vertical"
                value={activeTabIdx}
                onChange={handleChangeTab}
                aria-label="simple tabs example"
                indicatorColor={'primary'}
                textColor={'primary'}
                className={classes.tabs}
            >
                <Tab label="Codebase info" {...a11yProps(TAB_INDEXES[FORM_PART_CODEBASE_INFO])} />
                <Tab
                    label={`${capitalizeFirstLetter(type)} info`}
                    {...a11yProps(TAB_INDEXES[FORM_PART_CODEBASE_TYPE_INFO])}
                />
                <Tab
                    label="Advanced settings"
                    {...a11yProps(TAB_INDEXES[FORM_PART_ADVANCED_SETTINGS])}
                />
            </Tabs>
            <div className={classes.form}>
                <form onSubmit={handleSubmit(onSubmit, handleValidationError)}>
                    <div className={classes.formInner}>
                        <TabPanel
                            value={activeTabIdx}
                            index={TAB_INDEXES[FORM_PART_CODEBASE_INFO]}
                            className={classes.tabPanel}
                        >
                            <div className={classes.tabPanelInner}>
                                <Render condition={type === CODEBASE_TYPE_APPLICATION}>
                                    <ApplicationCodebaseInfoFormPart
                                        type={type}
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                    />
                                </Render>
                                <Render condition={type === CODEBASE_TYPE_LIBRARY}>
                                    <LibraryCodebaseInfoFormPart
                                        type={type}
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                    />
                                </Render>
                                <Render condition={type === CODEBASE_TYPE_AUTOTEST}>
                                    <AutotestCodebaseInfoFormPart
                                        type={type}
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                    />
                                </Render>
                            </div>
                        </TabPanel>
                        <TabPanel
                            value={activeTabIdx}
                            index={TAB_INDEXES[FORM_PART_CODEBASE_TYPE_INFO]}
                            className={classes.tabPanel}
                        >
                            <div className={classes.tabPanelInner}>
                                <Render condition={type === CODEBASE_TYPE_APPLICATION}>
                                    <ApplicationCodebaseTypeInfoFormPart
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                        type={type}
                                    />
                                </Render>
                                <Render condition={type === CODEBASE_TYPE_LIBRARY}>
                                    <LibraryCodebaseTypeInfoFormPart
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                        type={type}
                                    />
                                </Render>
                                <Render condition={type === CODEBASE_TYPE_AUTOTEST}>
                                    <AutotestCodebaseTypeInfoFormPart
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                        type={type}
                                    />
                                </Render>
                            </div>
                        </TabPanel>
                        <TabPanel
                            value={activeTabIdx}
                            index={TAB_INDEXES[FORM_PART_ADVANCED_SETTINGS]}
                            className={classes.tabPanel}
                        >
                            <div className={classes.tabPanelInner}>
                                <Render condition={type === CODEBASE_TYPE_APPLICATION}>
                                    <ApplicationAdvancedSettingsFormPart
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                    />
                                </Render>
                                <Render condition={type === CODEBASE_TYPE_LIBRARY}>
                                    <LibraryAdvancedSettingsFormPart
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                    />
                                </Render>
                                <Render condition={type === CODEBASE_TYPE_AUTOTEST}>
                                    <AutotestAdvancedSettingsFormPart
                                        names={names}
                                        handleFormFieldChange={handleFormFieldChange}
                                    />
                                </Render>
                            </div>
                        </TabPanel>
                    </div>
                    <div className={classes.tabPanelActions}>
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
                        <Render condition={activeTabIdx < TAB_INDEXES_LAST_INDEX}>
                            <Button
                                onClick={() => setActiveTabIdx(activeTabIdx + 1)}
                                variant={'contained'}
                                color={'primary'}
                                size="small"
                            >
                                proceed
                            </Button>
                        </Render>
                        <Render condition={activeTabIdx === TAB_INDEXES_LAST_INDEX}>
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                                size="small"
                                disabled={!isDirty}
                            >
                                apply
                            </Button>
                        </Render>
                    </div>
                </form>
            </div>
            <Render condition={!!editorOpen}>
                <EditorDialog
                    {...muDialogProps}
                    item={editorCode}
                    onClose={() => setEditorOpen(false)}
                    onSave={onEditorSave}
                />
            </Render>
        </FormProvider>
    );
};
