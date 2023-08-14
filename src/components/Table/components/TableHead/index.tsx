import {
    Box,
    ButtonBase,
    Checkbox,
    Grid,
    SvgIcon,
    TableCell,
    TableHead as MuiTableHead,
    TableRow,
    Typography,
    useTheme,
} from '@material-ui/core';
import React from 'react';
import { ValueOf } from '../../../../types/global';
import { rem } from '../../../../utils/styling/rem';
import { Render } from '../../../Render';
import { SORT_ORDERS } from '../../constants';
import { TableColumn } from '../../types';
import { TableHeadProps } from './types';

const isDesc = (columnId: string, sortBy: string, sortOrder: ValueOf<typeof SORT_ORDERS>) =>
    sortBy === columnId && sortOrder === SORT_ORDERS.DESC;
const isAsc = (columnId: string, sortBy: string, sortOrder: ValueOf<typeof SORT_ORDERS>) =>
    sortBy === columnId && sortOrder === SORT_ORDERS.ASC;

const getSortOrder = (isDesc: boolean, isAsc: boolean) =>
    isDesc ? SORT_ORDERS.ASC : isAsc ? SORT_ORDERS.UNSET : SORT_ORDERS.DESC;

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

    const [sortBy, setSortBy] = React.useState<string>(defaultSortBy);

    const handleRequestSort = (column: TableColumn<any>) => {
        const _isDesc = isDesc(column.id, sortBy, sortOrder);
        const _isAsc = isAsc(column.id, sortBy, sortOrder);
        const newSortOrder = getSortOrder(_isDesc, _isAsc);
        setSortOrder(newSortOrder);
        setSortBy(column.id);
        setColumnSortableValuePath(column.columnSortableValuePath);
    };

    const numSelected = React.useMemo(() => selected?.length, [selected]);

    const getColumnStyles = React.useCallback(
        (hasSortableValue: boolean) => ({
            pl: hasSortableValue ? theme.typography.pxToRem(6) : 0,
        }),
        [theme]
    );

    const getArrowsColors = React.useCallback(
        (activeColumnSort: boolean, sortOrder: ValueOf<typeof SORT_ORDERS>) => {
            return {
                upperArrowColor:
                    activeColumnSort && sortOrder === SORT_ORDERS.DESC
                        ? theme.palette.action.disabledBackground
                        : theme.palette.action.active,
                bottomArrowColor:
                    activeColumnSort && sortOrder === SORT_ORDERS.ASC
                        ? theme.palette.action.disabledBackground
                        : theme.palette.action.active,
            };
        },
        [theme]
    );

    return (
        <MuiTableHead>
            <Render condition={!!upperColumns?.length}>
                <TableRow>
                    {upperColumns?.length
                        ? upperColumns.map(
                              ({
                                  show = true,
                                  id,
                                  textAlign = 'left',
                                  colSpan = 1,
                                  columnSortableValuePath,
                                  render,
                              }) => {
                                  return (
                                      <Render condition={show}>
                                          <TableCell
                                              key={id}
                                              component="th"
                                              scope="row"
                                              align={textAlign || 'left'}
                                              colSpan={colSpan || 1}
                                              style={{
                                                  color: theme.palette.text.primary,
                                                  backgroundColor: theme.palette.background.paper,
                                                  padding: `${theme.typography.pxToRem(
                                                      8
                                                  )} ${theme.typography.pxToRem(16)}`,
                                              }}
                                          >
                                              <Box sx={getColumnStyles(!!columnSortableValuePath)}>
                                                  {render()}
                                              </Box>
                                          </TableCell>
                                      </Render>
                                  );
                              }
                          )
                        : null}
                </TableRow>
            </Render>
            <TableRow>
                <Render condition={!!handleSelectAllClick}>
                    <TableCell
                        padding="checkbox"
                        style={{
                            color: theme.palette.text.primary,
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <Checkbox
                            color={'primary'}
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={handleSelectAllClick}
                        />
                    </TableCell>
                </Render>
                {columns.map(column => {
                    const {
                        show = true,
                        id,
                        textAlign = 'left',
                        columnSortableValuePath,
                        label,
                    } = column;
                    const activeColumnSort = sortBy === id;
                    const { upperArrowColor, bottomArrowColor } = getArrowsColors(
                        activeColumnSort,
                        sortOrder
                    );

                    return (
                        <Render condition={show} key={id}>
                            <TableCell
                                sortDirection={sortBy === id ? sortOrder : false}
                                align={textAlign}
                                style={{
                                    color: theme.palette.text.primary,
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <Grid container spacing={1} alignItems={'center'} wrap={'nowrap'}>
                                    <Render condition={!!columnSortableValuePath}>
                                        <Grid item>
                                            <ButtonBase
                                                onClick={() => handleRequestSort(column)}
                                                disableRipple
                                            >
                                                <SvgIcon
                                                    viewBox={'0 0 18 18'}
                                                    width={theme.typography.pxToRem(18)}
                                                    height={theme.typography.pxToRem(18)}
                                                    style={{
                                                        width: theme.typography.pxToRem(18),
                                                        height: theme.typography.pxToRem(18),
                                                        display: 'block',
                                                    }}
                                                >
                                                    <path
                                                        d="M5.25 6L9 2.25L12.75 6H5.25Z"
                                                        fill={upperArrowColor}
                                                    />
                                                    <path
                                                        d="M5.25 12L9 15.75L12.75 12H5.25Z"
                                                        fill={bottomArrowColor}
                                                    />
                                                </SvgIcon>
                                            </ButtonBase>
                                        </Grid>
                                    </Render>
                                    <Grid item>
                                        <Typography
                                            variant={'body1'}
                                            style={{ fontWeight: 600, marginTop: rem(2) }}
                                        >
                                            {label}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </Render>
                    );
                })}
            </TableRow>
        </MuiTableHead>
    );
};
