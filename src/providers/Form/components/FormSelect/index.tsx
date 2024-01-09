import { ErrorMessage } from '@hookform/error-message';
import { Grid } from '@mui/material';
import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControlLabelWithTooltip } from '../FormControlLabelWithTooltip';
import { useStyles } from './styles';
import { FormSelectProps } from './types';

export const FormSelect = React.forwardRef(
  (
    {
      name,
      label,
      title,
      control,
      defaultValue = '',
      options = [],
      errors,
      placeholder,
      showLabelPlaceholder = false,
      disabled,
      ...props
    }: FormSelectProps,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    const hasError = !!errors[name];
    const classes = useStyles();

    const getOptionValue = React.useCallback(
      optionValue => {
        if (options.length) {
          const [foundOptionByName] = options.filter(({ value }) => value === optionValue);
          if (foundOptionByName) {
            return foundOptionByName.label;
          }
        }
        return defaultValue;
      },
      [defaultValue, options]
    );

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ display: 'flex' }}>
          <Grid container spacing={1}>
            {(!!label || showLabelPlaceholder) && (
              <Grid item xs={12}>
                <FormControlLabelWithTooltip label={label} title={title} />
              </Grid>
            )}
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <FormControl fullWidth>
                <Controller
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        inputRef={ref}
                        error={hasError}
                        displayEmpty
                        disabled={disabled}
                        fullWidth
                        renderValue={value => (value !== '' ? getOptionValue(value) : placeholder)}
                        className={clsx({
                          [classes.selectWithDefaultValue]: field.value === '',
                        })}
                      >
                        {options.map(({ label, value, disabled = false }, idx) => {
                          const key = `${label}::${idx}`;

                          return (
                            <MenuItem value={value} key={key} disabled={disabled}>
                              {label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    );
                  }}
                  name={name}
                  defaultValue={defaultValue}
                  control={control}
                  {...props}
                />
              </FormControl>
            </Grid>
          </Grid>
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
