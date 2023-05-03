import { Render } from '../../../../../../components/Render';
import { ICONS } from '../../../../../../constants/icons';
import { Iconify, MuiCore, MuiStyles, React } from '../../../../../../plugin.globals';
import { CDPipelineStageResourceLinkProps } from './types';

const { Grid, IconButton, Link: MuiLink, Tooltip } = MuiCore;

const { Icon } = Iconify;

const { useTheme } = MuiStyles;

const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

export const CDPipelineStageResourceLink = ({
    tooltipTitle,
    icon,
    link,
}: CDPipelineStageResourceLinkProps) => {
    const theme: DefaultTheme = useTheme();

    const btnStyles: React.CSSProperties = {
        cursor: link ? 'pointer' : 'default',
        pointerEvents: 'auto',
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div onClick={stopPropagation} onFocus={stopPropagation}>
            <Tooltip
                title={
                    <Grid container alignItems={'center'} spacing={1}>
                        <Grid item>{tooltipTitle}</Grid>
                        <Render condition={!!link}>
                            <Grid item>
                                <Icon
                                    icon={ICONS.NEW_WINDOW}
                                    color={theme.palette.grey['500']}
                                    width="15"
                                />
                            </Grid>
                        </Render>
                    </Grid>
                }
            >
                <IconButton
                    component={MuiLink}
                    href={link}
                    target={'_blank'}
                    disabled={!link}
                    style={btnStyles}
                >
                    <Icon icon={icon} color={theme.palette.grey['500']} width="20" />
                </IconButton>
            </Tooltip>
        </div>
    );
};