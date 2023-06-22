import { React } from '../../plugin.globals';
import { CLUSTERS_ROUTE_NAME } from '../../routes/names';
import { createSidebarItemName } from '../../utils/routes/createSidebarItemName';
import Page from './page';

export const routeEDPClusterList = {
    name: 'edp-cluster-list',
    path: `/edp/clusters`,
    sidebar: createSidebarItemName(CLUSTERS_ROUTE_NAME),
    component: () => <Page />,
    exact: true,
};