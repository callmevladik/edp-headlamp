import { makeStyles } from '@material-ui/core';
import { rem } from '../../../../utils/styling/rem';

export const useStyles = makeStyles(theme => {
    return {
        root: {
            minWidth: rem(70),
        },
        upper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: rem(48),
        },
        cardTitle: {
            textAlign: 'center',
        },
        wrapIcon: {
            display: 'inline-flex',
            verticalAlign: 'baseline',
            alignItems: 'center',
        },
        left: {
            display: 'flex',
        },
        right: {
            display: 'flex',
            marginLeft: theme.spacing(0.5),
        },
    };
});
