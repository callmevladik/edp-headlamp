import { FloatingActions } from '../../components/FloatingActions';
import { ApplicationExample } from '../../configs/kube-examples/edp-application';
import { EDPCodebaseKubeObject, streamCodebasesByTypeLabel } from '../../k8s/EDPCodebase';
import { EDPCodebaseKubeObjectConfig } from '../../k8s/EDPCodebase/config';
import { EDPCodebaseKubeObjectInterface } from '../../k8s/EDPCodebase/types';
import { pluginLib, React, ReactRouter } from '../../plugin.globals';
import { Table } from './components/Table';
import { EDPApplicationListProps } from './types';

const {
    CommonComponents: { SectionBox, SectionFilterHeader },
} = pluginLib;

const { useParams } = ReactRouter;

export const EDPApplicationList: React.FC<EDPApplicationListProps> = (): React.ReactElement => {
    const { namespace } = useParams();
    const [applications, setApplications] = React.useState<EDPCodebaseKubeObjectInterface[]>([]);
    const [, setError] = React.useState<string>('');

    const handleStoreApplications = React.useCallback(
        (applications: EDPCodebaseKubeObjectInterface[]) => {
            setApplications(applications);
        },
        []
    );

    const handleError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        const cancelStream = streamCodebasesByTypeLabel(
            EDPCodebaseKubeObjectConfig.types.application.name.singularForm,
            handleStoreApplications,
            handleError,
            namespace
        );

        return () => cancelStream();
    }, [handleError, handleStoreApplications, namespace]);

    return (
        <SectionBox title={<SectionFilterHeader title="Applications" headerStyle="main" />}>
            <FloatingActions
                kubeObject={EDPCodebaseKubeObject}
                kubeObjectExample={ApplicationExample}
            />
            <Table data={applications} />
        </SectionBox>
    );
};
