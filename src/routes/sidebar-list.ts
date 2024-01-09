import { ICONS } from '../icons/iconify-icons-mapping';
import { routeEDPGitServerList } from '../pages/edp-configuration/pages/edp-gitserver-list/route';
import { routeEDPOverviewList } from '../pages/edp-overview-list/route';
import { createNewSidebarItem } from '../utils/routes/createNewSidebarItem';
import { createSidebarItemName } from '../utils/routes/createSidebarItemName';
import {
  CDPIPELINES_ROUTE_NAME,
  COMPONENTS_ROUTE_NAME,
  CONFIGURATION_ROUTE_NAME,
  EDP_ROOT_ROUTE_NAME,
  MARKETPLACE_ROUTE_NAME,
  OVERVIEW_ROUTE_NAME,
} from './names';
import { SidebarItem } from './types';

export const SIDEBAR_LIST: SidebarItem[] = [
  {
    parentName: null,
    itemLabel: 'EDP',
    itemName: createSidebarItemName(EDP_ROOT_ROUTE_NAME),
    url: routeEDPOverviewList.path,
    opts: {
      icon: ICONS.ROCKET,
    },
  },
  createNewSidebarItem(
    'Overview',
    OVERVIEW_ROUTE_NAME,
    ICONS.PANEL,
    createSidebarItemName(EDP_ROOT_ROUTE_NAME)
  ),
  createNewSidebarItem(
    'Marketplace',
    MARKETPLACE_ROUTE_NAME,
    ICONS.BASKET,
    createSidebarItemName(EDP_ROOT_ROUTE_NAME)
  ),
  createNewSidebarItem(
    'Components',
    COMPONENTS_ROUTE_NAME,
    ICONS.APPLICATION,
    createSidebarItemName(EDP_ROOT_ROUTE_NAME)
  ),
  createNewSidebarItem(
    'Environments',
    CDPIPELINES_ROUTE_NAME,
    ICONS.INFINITY,
    createSidebarItemName(EDP_ROOT_ROUTE_NAME)
  ),
  {
    parentName: createSidebarItemName(EDP_ROOT_ROUTE_NAME),
    itemLabel: 'Configuration',
    itemName: createSidebarItemName(CONFIGURATION_ROUTE_NAME),
    url: routeEDPGitServerList.path,
    opts: {
      icon: ICONS.SETTINGS,
    },
  },
];
