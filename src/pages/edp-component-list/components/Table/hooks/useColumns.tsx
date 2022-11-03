import { HeadlampSimpleTableGetterColumn } from '../../../../../components/HeadlampSimpleTable/types';
import { Render } from '../../../../../components/Render';
import { UseSpriteSymbol } from '../../../../../icons/UseSpriteSymbol';
import { EDPComponentKubeObjectInterface } from '../../../../../k8s/EDPComponent/types';
import { Iconify, MuiCore, React } from '../../../../../plugin.globals';
import { sortByName } from '../../../../../utils/sort/sortByName';
import { rem } from '../../../../../utils/styling/rem';

const { Link, Typography } = MuiCore;
const { Icon } = Iconify;

export const useColumns = (classes: {
    [key: string]: string;
}): HeadlampSimpleTableGetterColumn<EDPComponentKubeObjectInterface>[] =>
    React.useMemo(
        () => [
            {
                label: 'Icon',
                getter: ({ spec: { url, visible, type } }) => (
                    <>
                        <Render condition={!!visible}>
                            <Link href={url} target="_blank" rel="noopener">
                                <UseSpriteSymbol name={type} width={rem(40)} height={rem(40)} />
                            </Link>
                        </Render>
                        <Render condition={!visible}>
                            <Icon
                                icon={'ph:placeholder-light'}
                                className={classes.serviceItemIcon}
                            />
                        </Render>
                    </>
                ),
            },
            {
                label: 'Name',
                getter: ({ spec: { url, type, visible } }) => (
                    <>
                        <Render condition={!!visible}>
                            <Link href={url} target="_blank" rel="noopener">
                                {type}
                            </Link>
                        </Render>
                        <Render condition={!visible}>
                            <Typography>{type}</Typography>
                        </Render>
                    </>
                ),
                sort: (a, b) => sortByName(a.spec.type, b.spec.type),
            },
            {
                label: 'Namespace',
                getter: ({ metadata: { namespace } }) => <>{namespace}</>,
                sort: (a, b) => sortByName(a.metadata.namespace, b.metadata.namespace),
            },
        ],
        [classes]
    );
