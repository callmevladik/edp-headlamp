import { ICON_BUCKET } from '../../../../../../constants/icons';
import { KUBE_OBJECT_ACTION_DELETE } from '../../../../../../constants/kubeObjectActions';
import { EDPCDPipelineStageKubeObjectInterface } from '../../../../../../k8s/EDPCDPipelineStage/types';
import { KubeObjectAction } from '../../../../../../types/actions';
import { createKubeAction } from '../../../../../../utils/actions/createKubeAction';

const getStageOrder = (stage: EDPCDPipelineStageKubeObjectInterface): number => stage.spec.order;

export const createDeleteAction = (
    allStages: EDPCDPipelineStageKubeObjectInterface[],
    currentStage: EDPCDPipelineStageKubeObjectInterface,
    action: () => void
): KubeObjectAction => {
    // CD pipeline could publish artifacts without any stage
    // so, in case it doesn't have any stage
    // probably this is something wrong and somebody messed-up CR
    if (allStages.length === 0) {
        throw new Error('CD Pipeline should have at least one stage');
    }

    // we don't let user remove last stage
    if (allStages.length === 1) {
        return createKubeAction({
            name: KUBE_OBJECT_ACTION_DELETE,
            disabled: {
                status: true,
                reason: 'CD pipeline should have at least one stage',
            },
            icon: ICON_BUCKET,
        });
    }

    const currentStageOrder = getStageOrder(currentStage);
    const otherStages = allStages.filter(el => el.metadata.name !== currentStage.metadata.name);
    const highestOtherStagesOrder = Math.max(...otherStages.map(getStageOrder));

    if (currentStageOrder > highestOtherStagesOrder) {
        return createKubeAction({
            name: KUBE_OBJECT_ACTION_DELETE,
            icon: ICON_BUCKET,
            action: action,
        });
    }

    return createKubeAction({
        name: KUBE_OBJECT_ACTION_DELETE,
        disabled: {
            status: true,
            reason: 'You are able to delete only the last stage',
        },
        icon: ICON_BUCKET,
    });
};