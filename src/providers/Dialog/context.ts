import React from 'react';
import { DialogContextProviderValue } from './types';

export const DialogContext = React.createContext<DialogContextProviderValue<null>>({
  dialogState: {},
  setDialog: () => {
    // empty fn
  },
  openDialog: () => {
    // empty fn
  },
  closeDialog: () => {
    // empty fn
  },
});
