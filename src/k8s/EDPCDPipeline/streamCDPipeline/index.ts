import { streamResult } from '../../common';
import { EDPCDPipelineKubeObjectConfig } from '../config';
import { EDPCDPipelineKubeObjectInterface } from '../types';
const {
    name: { pluralForm },
    group,
    version,
} = EDPCDPipelineKubeObjectConfig;

export const streamCDPipeline = (
    name: string,
    namespace: string,
    cb: (data: EDPCDPipelineKubeObjectInterface[]) => void,
    errCb: (err: Error) => void
): any => {
    const url = `/apis/${group}/${version}/namespaces/${namespace}/${pluralForm}`;
    return streamResult(url, name, cb, errCb);
};
