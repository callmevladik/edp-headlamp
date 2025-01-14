import { Icon } from '@iconify/react';
import { Link } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { IconButton, Typography } from '@material-ui/core';
import React from 'react';
import { StatusIcon } from '../../../../../components/StatusIcon';
import { TableColumn } from '../../../../../components/Table/types';
import { CUSTOM_RESOURCE_STATUSES } from '../../../../../constants/statuses';
import { ICONS } from '../../../../../icons/iconify-icons-mapping';
import { EDPCDPipelineKubeObject } from '../../../../../k8s/EDPCDPipeline';
import { EDPCDPipelineKubeObjectInterface } from '../../../../../k8s/EDPCDPipeline/types';
import { useResourceActionListContext } from '../../../../../providers/ResourceActionList/hooks';
import { HeadlampKubeObject } from '../../../../../types/k8s';
import { sortByName } from '../../../../../utils/sort/sortByName';
import { rem } from '../../../../../utils/styling/rem';
import { routeEDPCDPipelineDetails } from '../../../../edp-cdpipeline-details/route';
import { routeEDPComponentDetails } from '../../../../edp-component-details/route';

export const useColumns = (): TableColumn<
    HeadlampKubeObject<EDPCDPipelineKubeObjectInterface>
>[] => {
    const { handleOpenResourceActionListMenu } =
        useResourceActionListContext<EDPCDPipelineKubeObjectInterface>();

    return React.useMemo(
        () => [
            {
                id: 'status',
                label: 'Status',
                columnSortableValuePath: 'status.status',
                render: CDPipeline => {
                    const status = CDPipeline?.status?.status;
                    const detailedMessage = CDPipeline?.status?.detailed_message;

                    const [icon, color, isRotating] = EDPCDPipelineKubeObject.getStatusIcon(status);

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
                            color={color}
                            isRotating={isRotating}
                            Title={title}
                        />
                    );
                },
                width: '10%',
            },
            {
                id: 'cdPipeline',
                label: 'CD Pipeline',
                columnSortableValuePath: 'metadata.name',
                render: ({ metadata: { name, namespace } }) => {
                    return (
                        <Link
                            routeName={routeEDPCDPipelineDetails.path}
                            params={{
                                name,
                                namespace,
                            }}
                        >
                            {name}
                        </Link>
                    );
                },
                sort: (a, b) => sortByName(a.metadata.name, b.metadata.name),
                width: '30%',
            },
            {
                id: 'applications',
                label: 'Applications',
                columnSortableValuePath: 'spec.applications',
                render: ({ spec: { applications }, metadata: { namespace } }) => {
                    return (
                        <>
                            {applications.map((el, idx) => {
                                const propertyId = `${el}:${idx}`;

                                return (
                                    <React.Fragment key={propertyId}>
                                        <>
                                            {idx !== 0 && (
                                                <Typography component="span">, </Typography>
                                            )}
                                            <Link
                                                routeName={routeEDPComponentDetails.path}
                                                params={{
                                                    name: el,
                                                    namespace,
                                                }}
                                            >
                                                {el}
                                            </Link>
                                        </>
                                    </React.Fragment>
                                );
                            })}
                        </>
                    );
                },
            },
            {
                id: 'actions',
                label: '',
                render: ({ jsonData }) => {
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
