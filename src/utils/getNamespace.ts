import { defaultNamespace } from '../constants/defaultNamespace';
import { pluginLib } from '../plugin.globals';
const {
    Utils: { getCluster },
} = pluginLib;

export const getNamespace = () => {
    return (
        JSON.parse(localStorage.getItem(`cluster_settings.${getCluster()}`) || '{}')
            ?.defaultNamespace || defaultNamespace
    );
};
