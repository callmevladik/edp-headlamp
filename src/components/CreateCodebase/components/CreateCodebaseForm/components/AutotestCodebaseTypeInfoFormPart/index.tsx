import { useFormContext } from 'react-hook-form';
import { Applications } from '../../../../../../icons/sprites/Applications';
import { MuiCore, React } from '../../../../../../plugin.globals';
import ErrorBoundary from '../../../../../ErrorBoundary';
import {
    BuildTool,
    DefaultBranch,
    Framework,
    Lang,
    Name,
} from '../../../../../FormFields/CodebaseFields';
import { Description, TestReportFramework } from '../../../../../FormFields/CodebaseFields';
import { useChosenCodebaseLanguage } from '../../hooks/useChosenCodebaseLanguage';
import { AutotestCodebaseTypeInfoFormPartProps } from './types';

const { Grid } = MuiCore;

export const AutotestCodebaseTypeInfoFormPart = ({
    names,
    handleFormFieldChange,
    type,
}: AutotestCodebaseTypeInfoFormPartProps): React.ReactElement => {
    const { watch } = useFormContext();

    const langValue = watch(names.lang.name);

    const { chosenLang } = useChosenCodebaseLanguage({ type, langValue });

    return (
        <ErrorBoundary>
            <Applications />
            <Grid container spacing={2}>
                <Name names={names} handleFormFieldChange={handleFormFieldChange} type={type} />
                <DefaultBranch names={names} handleFormFieldChange={handleFormFieldChange} />
                <Description
                    type={type}
                    names={names}
                    handleFormFieldChange={handleFormFieldChange}
                />
                <Lang names={names} handleFormFieldChange={handleFormFieldChange} type={type} />
                {langValue && Object.values(chosenLang.frameworks).length ? (
                    <Framework
                        names={names}
                        handleFormFieldChange={handleFormFieldChange}
                        type={type}
                    />
                ) : null}
                {langValue ? (
                    <BuildTool
                        names={names}
                        handleFormFieldChange={handleFormFieldChange}
                        type={type}
                    />
                ) : null}
                <TestReportFramework names={names} handleFormFieldChange={handleFormFieldChange} />
            </Grid>
        </ErrorBoundary>
    );
};