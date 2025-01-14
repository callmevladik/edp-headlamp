import React from 'react';
import { UseQueryOptions } from 'react-query';
import { KubeObjectListInterface } from '../../../types/k8s';
import { EDPCDPipelineKubeObjectInterface } from '../types';
import { useCDPipelineListQuery } from './useCDPipelineListQuery';

interface UseCDPipelineByApplicationItUsesQueryProps {
    props: {
        codebaseName: string;
    };
    options?: UseQueryOptions<
        KubeObjectListInterface<EDPCDPipelineKubeObjectInterface>,
        Error,
        EDPCDPipelineKubeObjectInterface
    >;
}

export const useCDPipelineByApplicationItUsesQuery = ({
    props,
    options,
}: UseCDPipelineByApplicationItUsesQueryProps) => {
    const { codebaseName } = props;

    const query = useCDPipelineListQuery<EDPCDPipelineKubeObjectInterface>({
        options: {
            select: data => {
                for (const item of data?.items) {
                    if (item.spec.applications.includes(codebaseName)) {
                        return item;
                    }
                }
            },
            ...options,
            enabled: options?.enabled && !!codebaseName,
        },
    });

    return React.useMemo(() => query, [query]);
};
