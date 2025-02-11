import {
    Box,
    TableCell,
    TableHead as MuiTableHead,
    TableRow as MuiTableRow,
    useTheme,
} from '@material-ui/core';
import React from 'react';
import { TableRow } from './components/TableRow';
import { TableHeadProps } from './types';

export const TableHead = ({
    columns,
    upperColumns,
    sortOrder,
    setSortOrder,
    defaultSortBy = 'name',
    setColumnSortableValuePath,
    rowCount,
    selected,
    handleSelectAllClick,
}: TableHeadProps) => {
    const theme = useTheme();

    const getColumnStyles = React.useCallback(
        (hasSortableValue: boolean) => ({
            pl: hasSortableValue ? theme.typography.pxToRem(6) : 0,
        }),
        [theme]
    );

    return (
        <MuiTableHead>
            {!!upperColumns && !!upperColumns?.length ? (
                <MuiTableRow>
                    {upperColumns.map(
                        ({
                            show = true,
                            id,
                            textAlign = 'left',
                            colSpan = 1,
                            columnSortableValuePath,
                            render,
                        }) => {
                            return show ? (
                                <TableCell
                                    key={id}
                                    component="th"
                                    scope="row"
                                    align={textAlign || 'left'}
                                    colSpan={colSpan || 1}
                                    style={{
                                        color: theme.palette.text.primary,
                                        backgroundColor: theme.palette.tables.head.background,
                                        padding: `${theme.typography.pxToRem(
                                            8
                                        )} ${theme.typography.pxToRem(16)}`,
                                    }}
                                >
                                    <Box sx={getColumnStyles(!!columnSortableValuePath)}>
                                        {render()}
                                    </Box>
                                </TableCell>
                            ) : null;
                        }
                    )}
                </MuiTableRow>
            ) : null}
            <TableRow
                columns={columns}
                defaultSortBy={defaultSortBy}
                rowCount={rowCount}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setColumnSortableValuePath={setColumnSortableValuePath}
                selected={selected}
                handleSelectAllClick={handleSelectAllClick}
            />
        </MuiTableHead>
    );
};
