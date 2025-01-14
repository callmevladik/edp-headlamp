import { Icon } from '@iconify/react';
import { Link } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Grid, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { ConditionalWrapper } from '../../../../../components/ConditionalWrapper';
import { StatusIcon } from '../../../../../components/StatusIcon';
import { TableColumn } from '../../../../../components/Table/types';
import { CODEBASE_TYPES } from '../../../../../constants/codebaseTypes';
import { CUSTOM_RESOURCE_STATUSES } from '../../../../../constants/statuses';
import { ICONS } from '../../../../../icons/iconify-icons-mapping';
import { EDPCodebaseKubeObject } from '../../../../../k8s/EDPCodebase';
import { EnrichedApplicationWithItsImageStreams } from '../../../../../k8s/EDPCodebase/hooks/useEnrichedApplicationsWithImageStreamsQuery';
import { rem } from '../../../../../utils/styling/rem';
import { routeEDPComponentDetails } from '../../../../edp-component-details/route';

export const useColumns = (): TableColumn<EnrichedApplicationWithItsImageStreams>[] =>
    React.useMemo(
        () => [
            {
                id: 'status',
                label: 'Status',
                render: ({ application }) => {
                    const status = application?.status?.status;
                    const detailedMessage = application?.status?.detailedMessage;
                    const type = application?.spec?.type;

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
                        <ConditionalWrapper
                            condition={type === CODEBASE_TYPES.SYSTEM}
                            wrapper={children => (
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems={'center'}
                                    style={{ margin: 0 }}
                                >
                                    {children}
                                    <Grid item>
                                        <Tooltip title={'System codebase'}>
                                            <Icon
                                                icon={ICONS.SCREWDRIVER}
                                                width={25}
                                                style={{
                                                    display: 'block',
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            )}
                        >
                            <StatusIcon
                                icon={icon}
                                isRotating={isRotating}
                                color={color}
                                Title={title}
                            />
                        </ConditionalWrapper>
                    );
                },
                width: '10%',
            },
            {
                id: 'application',
                label: 'Application',
                render: ({
                    application: {
                        metadata: { name, namespace },
                    },
                }) => {
                    return (
                        <Link
                            routeName={routeEDPComponentDetails.path}
                            params={{
                                name,
                                namespace,
                            }}
                        >
                            {name}
                        </Link>
                    );
                },
                width: '40%',
            },
            {
                id: 'imageStream',
                label: 'Image stream',
                render: ({ applicationImageStream }) => applicationImageStream?.metadata?.name,
                width: '40%',
            },
            {
                id: 'toPromote',
                label: 'To promote',
                render: ({ toPromote }) => (
                    <Icon icon={toPromote ? ICONS.ACCEPT_ARROW : ICONS.CROSS} width="20" />
                ),
                textAlign: 'center',
            },
        ],
        []
    );
