import { Icon } from '@iconify/react';
import { Link } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box, Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { ConditionalWrapper } from '../../../../../components/ConditionalWrapper';
import { StatusIcon } from '../../../../../components/StatusIcon';
import { TableColumn } from '../../../../../components/Table/types';
import {
    BUILD_TOOL_ICON_MAPPING,
    FRAMEWORK_ICON_MAPPING,
    LANGUAGE_ICON_MAPPING,
} from '../../../../../configs/icon-mappings';
import { CODEBASE_TYPES } from '../../../../../constants/codebaseTypes';
import { CUSTOM_RESOURCE_STATUSES } from '../../../../../constants/statuses';
import { ICONS } from '../../../../../icons/iconify-icons-mapping';
import { RESOURCE_ICON_NAMES } from '../../../../../icons/sprites/Resources/names';
import { UseSpriteSymbol } from '../../../../../icons/UseSpriteSymbol';
import { EDPCodebaseKubeObject } from '../../../../../k8s/EDPCodebase';
import { EDPCodebaseKubeObjectInterface } from '../../../../../k8s/EDPCodebase/types';
import { useResourceActionListContext } from '../../../../../providers/ResourceActionList/hooks';
import { HeadlampKubeObject } from '../../../../../types/k8s';
import { capitalizeFirstLetter } from '../../../../../utils/format/capitalizeFirstLetter';
import { getCodebaseMappingByCodebaseType } from '../../../../../utils/getCodebaseMappingByCodebaseType';
import { rem } from '../../../../../utils/styling/rem';
import { routeEDPComponentDetails } from '../../../../edp-component-details/route';

export const useColumns = (): TableColumn<HeadlampKubeObject<EDPCodebaseKubeObjectInterface>>[] => {
    const { handleOpenResourceActionListMenu } =
        useResourceActionListContext<EDPCodebaseKubeObjectInterface>();

    return React.useMemo(
        () => [
            {
                id: 'status',
                label: 'Status',
                columnSortableValuePath: 'status.status',
                render: codebase => {
                    const status = codebase?.status?.status;
                    const detailedMessage = codebase?.status?.detailedMessage;

                    const [icon, color, isRotating] = EDPCodebaseKubeObject.getStatusIcon(status);

                    const title = (
                        <>
                            <Typography variant={'subtitle2'} style={{ fontWeight: 600 }}>
                                {`Status: ${status || 'Unknown'}`}
                            </Typography>
                            {status === CUSTOM_RESOURCE_STATUSES.FAILED && (
                                <Typography variant={'subtitle2'} style={{ marginTop: rem(10) }}>
                                    {detailedMessage}
                                </Typography>
                            )}
                        </>
                    );

                    return (
                        <StatusIcon
                            icon={icon}
                            isRotating={isRotating}
                            color={color}
                            Title={title}
                        />
                    );
                },
                width: '10%',
                textAlign: 'left',
            },
            {
                id: 'name',
                label: 'Name',
                columnSortableValuePath: 'metadata.name',
                render: ({ metadata: { name, namespace }, spec: { type } }) => {
                    return (
                        <ConditionalWrapper
                            condition={type === CODEBASE_TYPES.SYSTEM}
                            wrapper={children => (
                                <Grid container spacing={1} alignItems={'center'} wrap={'nowrap'}>
                                    <Grid item>{children}</Grid>
                                    <Grid item>
                                        <Tooltip title={'System component'}>
                                            <Icon
                                                icon={ICONS.INFO_CIRCLE}
                                                width={18}
                                                style={{ display: 'block' }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            )}
                        >
                            <Link
                                routeName={routeEDPComponentDetails.path}
                                params={{
                                    name,
                                    namespace,
                                }}
                            >
                                {name}
                            </Link>
                        </ConditionalWrapper>
                    );
                },
                width: '35%',
            },
            {
                id: 'type',
                label: 'Type',
                columnSortableValuePath: 'spec.type',
                render: ({ spec: { type } }) => capitalizeFirstLetter(type),
                width: '15%',
            },
            {
                id: 'language',
                label: 'Language',
                columnSortableValuePath: 'spec.lang',
                render: ({ spec: { lang, type } }) => {
                    const codebaseMapping = getCodebaseMappingByCodebaseType(type);

                    return (
                        <Grid container spacing={1} alignItems={'center'} wrap={'nowrap'}>
                            <Grid item>
                                <UseSpriteSymbol
                                    name={
                                        LANGUAGE_ICON_MAPPING?.[lang?.toLowerCase()] ||
                                        RESOURCE_ICON_NAMES.OTHER
                                    }
                                    width={20}
                                    height={20}
                                />
                            </Grid>
                            <Grid item>
                                {codebaseMapping?.[lang]?.language?.name ||
                                    capitalizeFirstLetter(lang)}
                            </Grid>
                        </Grid>
                    );
                },
                width: '15%',
            },
            {
                id: 'framework',
                label: 'Framework',
                columnSortableValuePath: 'spec.lang',
                render: ({ spec: { lang, framework, type } }) => {
                    const codebaseMapping = getCodebaseMappingByCodebaseType(type);

                    return (
                        <Grid container spacing={1} alignItems={'center'} wrap={'nowrap'}>
                            <Grid item>
                                <UseSpriteSymbol
                                    name={
                                        FRAMEWORK_ICON_MAPPING?.[framework?.toLowerCase()] ||
                                        RESOURCE_ICON_NAMES.OTHER
                                    }
                                    width={20}
                                    height={20}
                                />
                            </Grid>
                            <Grid item>
                                {codebaseMapping?.[lang]?.frameworks?.[framework]?.name ||
                                    capitalizeFirstLetter(framework)}
                            </Grid>
                        </Grid>
                    );
                },
                width: '15%',
            },
            {
                id: 'buildTool',
                label: 'Build Tool',
                columnSortableValuePath: 'spec.buildTool',
                render: ({ spec: { lang, buildTool, type } }) => {
                    const codebaseMapping = getCodebaseMappingByCodebaseType(type);

                    return (
                        <Grid container spacing={1} alignItems={'center'} wrap={'nowrap'}>
                            <Grid item>
                                <UseSpriteSymbol
                                    name={
                                        BUILD_TOOL_ICON_MAPPING?.[buildTool?.toLowerCase()] ||
                                        RESOURCE_ICON_NAMES.OTHER
                                    }
                                    width={20}
                                    height={20}
                                />
                            </Grid>
                            <Grid item>
                                {codebaseMapping?.[lang]?.buildTools?.[buildTool]?.name ||
                                    capitalizeFirstLetter(buildTool)}
                            </Grid>
                        </Grid>
                    );
                },
                width: '15%',
            },
            {
                id: 'actions',
                label: '',
                render: ({ jsonData, spec: { type } }) => {
                    if (type === CODEBASE_TYPES.SYSTEM) {
                        return <Box sx={{ height: rem(44) }} />;
                    }

                    const buttonRef = React.createRef<HTMLButtonElement>();

                    return (
                        <IconButton
                            ref={buttonRef}
                            aria-label={'Options'}
                            onClick={() =>
                                handleOpenResourceActionListMenu(buttonRef.current, jsonData)
                            }
                        >
                            <Icon icon={ICONS.THREE_DOTS} color={'grey'} width="20" />
                        </IconButton>
                    );
                },
            },
        ],
        [handleOpenResourceActionListMenu]
    );
};
