import { Icon } from '@iconify/react';
import { Grid, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { GIT_PROVIDERS } from '../../../../../../constants/gitProviders';
import { ICONS } from '../../../../../../icons/iconify-icons-mapping';
import { useFormContext } from '../../../../../../providers/Form/hooks';
import { ManageGitServerDataContext } from '../../../../types';
import {
  GitProvider,
  HostName,
  HTTPSPort,
  SSHPort,
  SSHPrivateKey,
  SSHPublicKey,
  Token,
  UserName,
} from '../../../fields';

export const Form = () => {
  const {
    formData: { gitServer, gitServerSecret },
  } = useFormContext<ManageGitServerDataContext>();
  const gitServerSecretOwnerReference = gitServerSecret?.metadata?.ownerReferences?.[0].kind;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <GitProvider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <HostName />
            </Grid>
            <Grid item xs={6}>
              <UserName />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SSHPort />
            </Grid>
            <Grid item xs={6}>
              <HTTPSPort />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems={'center'}>
                <Grid item>
                  <Typography variant={'h6'}>Credentials</Typography>
                </Grid>
                {!!gitServerSecretOwnerReference && (
                  <Grid item>
                    <Tooltip title={`Managed by ${gitServerSecretOwnerReference}`}>
                      <Icon
                        icon={ICONS.CLOUD_LOCK}
                        width={20}
                        style={{
                          display: 'block',
                        }}
                      />
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {gitServer.spec.gitProvider === GIT_PROVIDERS.GERRIT && (
              <>
                <Grid item xs={12}>
                  <SSHPrivateKey />
                </Grid>
                <Grid item xs={12}>
                  <SSHPublicKey />
                </Grid>
              </>
            )}
            {gitServer.spec.gitProvider === GIT_PROVIDERS.GITLAB && (
              <>
                <Grid item xs={12}>
                  <SSHPrivateKey />
                </Grid>
                <Grid item xs={12}>
                  <Token />
                </Grid>
              </>
            )}
            {gitServer.spec.gitProvider === GIT_PROVIDERS.GITHUB && (
              <>
                <Grid item xs={12}>
                  <SSHPrivateKey />
                </Grid>
                <Grid item xs={12}>
                  <Token />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
