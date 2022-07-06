import clsx from 'clsx';
import { capitalizeFirstLetter } from '../../utils/format/capitalizeFirstLetter';
import { getStatusIconByStatusName } from '../../utils/styling/getStatusIconByStatusName';
import { useStyles } from './styles';
import { StatusIconProps } from './types';

const {
    pluginLib: { React, MuiCore, Iconify },
} = globalThis;
const { Tooltip } = MuiCore;
const { Icon } = Iconify;

export const StatusIcon: React.FC<StatusIconProps> = ({ status }): React.ReactElement => {
    const classes = useStyles();

    const [icon, color, animate] = getStatusIconByStatusName(status);
    return (
        <div className={classes.iconWrapper}>
            <Tooltip title={capitalizeFirstLetter(status)}>
                <Icon
                    icon={icon}
                    color={color}
                    width="25"
                    className={clsx({
                        [classes.icon]: animate,
                        [classes.rotateIcon]: animate,
                    })}
                />
            </Tooltip>
        </div>
    );
};
