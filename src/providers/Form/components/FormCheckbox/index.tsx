import { ErrorMessage } from '@hookform/error-message';
import { Checkbox, FormControl, FormControlLabel, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Controller } from 'react-hook-form';
import { rem } from '../../../../utils/styling/rem';
import { FormCheckboxProps } from './types';

export const FormCheckbox = React.forwardRef(
    (
        {
            name,
            label,
            control,
            errors,
            defaultValue = false,
            disabled,
            align = 'flex-start',
            ...props
        }: FormCheckboxProps,
        ref: React.RefObject<HTMLInputElement>
    ) => {
        const hasError = !!errors[name];

        return (
            <Grid container spacing={1}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: align }}>
                    <FormControl>
                        <Controller
                            render={({ field }) => {
                                return (
                                    <FormControlLabel
                                        style={{ margin: 0 }}
                                        control={
                                            <Checkbox
                                                {...field}
                                                color={'primary'}
                                                checked={!!field.value}
                                                inputRef={ref}
                                                onChange={e => field.onChange(e.target.checked)}
                                                disabled={disabled}
                                            />
                                        }
                                        label={
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    marginTop: rem(2),
                                                }}
                                            >
                                                {label}
                                            </span>
                                        }
                                    />
                                );
                            }}
                            defaultValue={defaultValue}
                            name={name}
                            control={control}
                            {...props}
                        />
                    </FormControl>
                </Grid>
                {hasError && (
                    <Grid item xs={12}>
                        <Typography component={'span'} variant={'subtitle2'} color={'error'}>
                            <ErrorMessage errors={errors} name={name} />
                        </Typography>
                    </Grid>
                )}
            </Grid>
        );
    }
);
