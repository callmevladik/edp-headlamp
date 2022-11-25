import { ICONS } from '../../../constants/icons';
import {
    CUSTOM_RESOURCE_ACTIVE_STATUSES,
    CUSTOM_RESOURCE_STATUSES,
    PIPELINE_RUN_STATUSES,
} from '../../../constants/statuses';
import { IconProps, StatusType } from './types';

export const getCustomResourceStatusIconByStatusName = (status: StatusType): IconProps => {
    switch (status) {
        case CUSTOM_RESOURCE_STATUSES['CREATED']:
            return [ICONS['CHECK_CIRCLE'], '#327335'];

        case CUSTOM_RESOURCE_ACTIVE_STATUSES['ACTIVE']:
            return [ICONS['CHECK_CIRCLE'], '#327335'];

        case PIPELINE_RUN_STATUSES['SUCCEEDED']:
            return [ICONS['CHECK_CIRCLE'], '#327335'];

        case CUSTOM_RESOURCE_STATUSES['FAILED']:
            return [ICONS['CROSS_CIRCLE'], '#ba3329'];

        case PIPELINE_RUN_STATUSES['FAILED']:
            return [ICONS['CROSS_CIRCLE'], '#ba3329'];

        case CUSTOM_RESOURCE_ACTIVE_STATUSES['INACTIVE']:
            return [ICONS['CROSS_CIRCLE'], '#ba3329'];

        case CUSTOM_RESOURCE_STATUSES['INITIALIZED']:
            return [ICONS['LOADER_CIRCLE'], '#009dff', true];

        case CUSTOM_RESOURCE_STATUSES['IN_PROGRESS']:
            return [ICONS['LOADER_CIRCLE'], '#009dff', true];

        case PIPELINE_RUN_STATUSES['RUNNING']:
            return [ICONS['LOADER_CIRCLE'], '#009dff', true];

        case CUSTOM_RESOURCE_STATUSES['UNKNOWN']:
            return [ICONS['EMPTY_CIRCLE'], 'grey'];

        default:
            return [ICONS['LOADER_CIRCLE'], '#009dff', true];
    }
};