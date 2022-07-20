import { FloatingActions } from '../../components/FloatingActions';
import { CDPipelineExample } from '../../configs/kube-examples/edp-cdpipeline';
import { EDPCDPipelineKubeObject } from '../../k8s/EDPCDPipeline';
import { streamCDPipelines } from '../../k8s/EDPCDPipeline/streamCDPipelines';
import { EDPCDPipelineKubeObjectInterface } from '../../k8s/EDPCDPipeline/types';
import { pluginLib, React, ReactRouter } from '../../plugin.globals';
import { Table } from './components/Table';
import { EDPCDPipelineListProps } from './types';

const {
    CommonComponents: { SectionBox, SectionFilterHeader },
} = pluginLib;

const { useParams } = ReactRouter;

export const EDPCDPipelineList: React.FC<EDPCDPipelineListProps> = (): React.ReactElement => {
    const { namespace } = useParams();

    const [CDPipelines, setCDPipelines] = React.useState<EDPCDPipelineKubeObjectInterface[]>([]);
    const [, setError] = React.useState<string>('');

    const handleStoreCDPipelines = React.useCallback(
        (cdpipelines: EDPCDPipelineKubeObjectInterface[]) => {
            setCDPipelines(cdpipelines);
        },
        []
    );

    const handleError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        streamCDPipelines(handleStoreCDPipelines, handleError, namespace);
    }, [handleError, handleStoreCDPipelines, namespace]);

    return (
        <SectionBox title={<SectionFilterHeader title="CD Pipelines" headerStyle="main" />}>
            <FloatingActions
                kubeObject={EDPCDPipelineKubeObject}
                kubeObjectExample={CDPipelineExample}
            />
            <Table data={CDPipelines} />
        </SectionBox>
    );
};
