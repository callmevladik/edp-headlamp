import { GridSize } from '@mui/material';
import React from 'react';
import { Control } from 'react-hook-form/dist/types';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

export interface MainRadioGroupOption {
  value: string;
  label: string;
  description?: string;
  icon: React.ReactElement;
  checkedIcon: React.ReactElement;
  disabled?: boolean;
}

export interface MainRadioGroupProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  gridItemSize: GridSize;
  options: MainRadioGroupOption[];
}
