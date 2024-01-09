import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useSpecificDialogContext } from '../../providers/Dialog/hooks';
import { DELETE_KUBE_OBJECT_DIALOG_NAME } from './constants';
import { useDeleteKubeObject } from './hooks/useDeleteKubeObject';
import { DeleteKubeObjectDialogForwardedProps } from './types';

const NAMES = {
  name: 'name',
};

const getDialogTitle = (errorTemplate: React.ReactNode, objectName: string): string =>
  !errorTemplate ? `Confirm deletion of "${objectName}"` : `Cannot start deleting "${objectName}"`;

export const DeleteKubeObject = () => {
  const history = useHistory();
  const {
    open,
    forwardedProps: {
      onSuccess,
      objectName,
      kubeObjectData,
      kubeObject,
      onBeforeSubmit,
      description,
      backRoute,
    },
    closeDialog,
    openDialog,
  } = useSpecificDialogContext<DeleteKubeObjectDialogForwardedProps>(
    DELETE_KUBE_OBJECT_DIALOG_NAME
  );

  const [errorTemplate, setErrorTemplate] = React.useState<React.ReactNode | string>(null);
  const [loadingActive, setLoadingActive] = React.useState<boolean>(false);
  const { register, handleSubmit, watch, reset } = useForm();
  const kubeObjectNameFieldValue = watch(NAMES.name);

  const handleClosePopup = React.useCallback(
    (_?, reason?: string) => (reason !== 'backdropClick' ? closeDialog() : false),
    [closeDialog]
  );

  const handleOpenPopup = React.useCallback(() => {
    openDialog();
  }, [openDialog]);

  const { deleteKubeObject } = useDeleteKubeObject({
    onSuccess: onSuccess,
    onError: handleOpenPopup,
  });

  const onSubmit = React.useCallback(
    async ({ name }) => {
      if (errorTemplate || objectName !== name) {
        return;
      }

      handleClosePopup();
      await deleteKubeObject({
        kubeObject,
        kubeObjectData,
      });
      reset();

      if (backRoute) {
        history.push(backRoute);
      }
    },
    [
      errorTemplate,
      objectName,
      handleClosePopup,
      deleteKubeObject,
      kubeObject,
      kubeObjectData,
      reset,
      backRoute,
      history,
    ]
  );

  React.useEffect(() => {
    (async () => {
      const validateObject = async () => {
        if (onBeforeSubmit !== undefined && open) {
          await onBeforeSubmit(setErrorTemplate, setLoadingActive);
        }
      };

      await validateObject();
    })();
  }, [onBeforeSubmit, open]);

  const isSubmitNotAllowed = kubeObjectNameFieldValue !== objectName || !!errorTemplate;
  const dialogTitle = React.useMemo(
    () => getDialogTitle(errorTemplate, objectName),
    [errorTemplate, objectName]
  );

  return (
    <Dialog open={open} onClose={handleClosePopup} fullWidth data-testid="dialog">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          {!loadingActive && !errorTemplate && (
            <Grid item xs={12}>
              <Typography>{description}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={1}>
                {!!loadingActive && (
                  <Grid container justifyContent="center">
                    <Grid item>
                      <CircularProgress />
                    </Grid>
                  </Grid>
                )}
                {!!errorTemplate && !loadingActive && (
                  <Grid item xs={12}>
                    {errorTemplate}
                  </Grid>
                )}
                {!loadingActive && !errorTemplate && (
                  <Grid item xs={12}>
                    <TextField
                      {...register(NAMES.name, { required: true })}
                      label={`Enter ${kubeObjectData?.kind} name to delete`}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <DialogActions>
                    <Button type={'button'} onClick={handleClosePopup}>
                      Cancel
                    </Button>
                    <Button type={'submit'} disabled={isSubmitNotAllowed}>
                      Confirm
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
