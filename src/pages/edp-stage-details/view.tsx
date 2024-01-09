import { Chip, CircularProgress, Grid, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router-dom';
import { InfoColumnsAccordion } from '../../components/InfoColumns';
import { PageWrapper } from '../../components/PageWrapper';
import { ResourceIconLink } from '../../components/ResourceIconLink';
import { Section } from '../../components/Section';
import { StatusIcon } from '../../components/StatusIcon';
import { Tabs } from '../../components/Tabs';
import { PIPELINE_TYPES } from '../../constants/pipelineTypes';
import { TRIGGER_TYPES } from '../../constants/triggerTypes';
import { ICONS } from '../../icons/iconify-icons-mapping';
import { useStreamApplicationListByPipelineStageLabel } from '../../k8s/Application/hooks/useStreamApplicationListByPipelineStageLabel';
import { EDPCDPipelineStageKubeObject } from '../../k8s/EDPCDPipelineStage';
import { useEDPComponentsURLsQuery } from '../../k8s/EDPComponent/hooks/useEDPComponentsURLsQuery';
import { PipelineRunKubeObject } from '../../k8s/PipelineRun';
import { PIPELINE_RUN_REASON } from '../../k8s/PipelineRun/constants';
import { useStreamAutotestPipelineRunList } from '../../k8s/PipelineRun/hooks/useStreamAutotestPipelineRunList';
import { useStreamAutotestRunnerPipelineRunList } from '../../k8s/PipelineRun/hooks/useStreamAutotestRunnerPipelineRunList';
import { useStreamPipelineRunListByTypeAndPipelineNameLabels } from '../../k8s/PipelineRun/hooks/useStreamPipelineRunListByTypeAndPipelineNameLabels';
import { FormContextProvider } from '../../providers/Form';
import { LinkCreationService } from '../../services/link-creation';
import { sortKubeObjectByCreationTimestamp } from '../../utils/sort/sortKubeObjectsByCreationTimestamp';
import { rem } from '../../utils/styling/rem';
import { routeEDPCDPipelineDetails } from '../edp-cdpipeline-details/route';
import { routeEDPCDPipelineList } from '../edp-cdpipeline-list/route';
import { Applications } from './components/Applications';
import { CustomGates } from './components/CustomGates';
import { QualityGates } from './components/QualityGates';
import { StageActions } from './components/StageActions';
import { useEnrichedApplicationsWithArgoApplications } from './hooks/useEnrichedApplicationsWithArgoApplication';
import { useEveryArgoAppIsHealthyAndInSync } from './hooks/useEveryArgoAppIsHealthyAndInSync';
import { useDataContext } from './providers/Data/hooks';
import { useDynamicDataContext } from './providers/DynamicData/hooks';
import { useStyles } from './styles';
import { EnrichedQualityGateWithAutotestPipelineRun } from './types';
import { EDPStageDetailsRouteParams } from './types';

export const PageView = () => {
  const classes = useStyles();
  const { CDPipelineName, namespace } = useParams<EDPStageDetailsRouteParams>();

  const { CDPipeline, enrichedApplications } = useDataContext();
  const { stage } = useDynamicDataContext();
  const { data: EDPComponentsURLS } = useEDPComponentsURLsQuery(namespace);

  const stageSpecName = stage?.spec.name;
  const stageMetadataName = stage?.metadata.name;

  const latestTenDeployPipelineRuns = useStreamPipelineRunListByTypeAndPipelineNameLabels({
    namespace,
    pipelineType: PIPELINE_TYPES.DEPLOY,
    stageMetadataName,
    select: React.useCallback(data => {
      return data.sort(sortKubeObjectByCreationTimestamp).slice(0, 10);
    }, []),
  });

  const latestAutotestRunnerPipelineRuns = useStreamAutotestRunnerPipelineRunList({
    namespace,
    stageSpecName,
    CDPipelineMetadataName: CDPipelineName,
    select: React.useCallback(data => {
      return data.sort(sortKubeObjectByCreationTimestamp).slice(0, 1);
    }, []),
  });

  const latestAutotestRunnerPipelineRunName = React.useMemo(
    () => latestAutotestRunnerPipelineRuns?.[0]?.metadata.name,
    [latestAutotestRunnerPipelineRuns]
  );

  const latestTenAutotestPipelineRuns = useStreamAutotestPipelineRunList({
    namespace,
    stageSpecName,
    CDPipelineMetadataName: CDPipelineName,
    parentPipelineRunName: latestAutotestRunnerPipelineRunName,
    select: React.useCallback(data => {
      return data.sort(sortKubeObjectByCreationTimestamp).slice(0, 10);
    }, []),
  });

  const enrichedQualityGatesWithPipelineRuns: EnrichedQualityGateWithAutotestPipelineRun[] =
    React.useMemo(
      () =>
        stage?.spec.qualityGates.map(qualityGate => {
          const autotestPipelineRun = latestTenAutotestPipelineRuns.find(
            pipelineRun =>
              pipelineRun.metadata.labels['app.edp.epam.com/codebase'] === qualityGate.autotestName
          );

          return {
            qualityGate: qualityGate,
            autotestPipelineRun: autotestPipelineRun,
          };
        }),
      [stage?.spec.qualityGates, latestTenAutotestPipelineRuns]
    );

  const latestDeployPipelineRunIsRunning = React.useMemo(
    () =>
      PipelineRunKubeObject.parseStatusReason(latestTenDeployPipelineRuns?.[0]) ===
      PIPELINE_RUN_REASON.RUNNING,
    [latestTenDeployPipelineRuns]
  );

  const argoApplications = useStreamApplicationListByPipelineStageLabel({
    namespace,
    stageSpecName,
    CDPipelineMetadataName: CDPipelineName,
  });

  const enrichedApplicationsWithArgoApplications = useEnrichedApplicationsWithArgoApplications({
    enrichedApplicationsWithItsImageStreams: enrichedApplications,
    argoApplications,
  });

  const everyArgoAppIsHealthyAndInSync = useEveryArgoAppIsHealthyAndInSync(
    enrichedApplicationsWithArgoApplications
  );

  const tabs = React.useMemo(
    () => [
      {
        label: 'Applications',
        id: 'applications',
        component: (
          <FormContextProvider formSettings={{ mode: 'onBlur' }}>
            <Applications
              enrichedApplicationsWithArgoApplications={enrichedApplicationsWithArgoApplications}
              qualityGatePipelineIsRunning={latestDeployPipelineRunIsRunning}
            />
          </FormContextProvider>
        ),
      },
      {
        label: 'Quality Gates',
        id: 'quality_gates',
        component: (
          <QualityGates
            enrichedQualityGatesWithPipelineRuns={enrichedQualityGatesWithPipelineRuns}
            argoApplications={argoApplications}
            everyArgoAppIsHealthyAndInSync={everyArgoAppIsHealthyAndInSync}
            latestAutotestRunnerPipelineRuns={latestAutotestRunnerPipelineRuns}
            latestTenAutotestPipelineRuns={latestTenAutotestPipelineRuns}
          />
        ),
      },
      {
        label: 'Custom Gates',
        id: 'custom_gates',
        component: (
          <CustomGates
            enrichedApplicationsWithArgoApplications={enrichedApplicationsWithArgoApplications}
            argoApplications={argoApplications}
            latestTenDeployPipelineRuns={latestTenDeployPipelineRuns}
            everyArgoAppIsHealthyAndInSync={everyArgoAppIsHealthyAndInSync}
          />
        ),
      },
    ],
    [
      argoApplications,
      enrichedApplicationsWithArgoApplications,
      enrichedQualityGatesWithPipelineRuns,
      everyArgoAppIsHealthyAndInSync,
      latestAutotestRunnerPipelineRuns,
      latestDeployPipelineRunIsRunning,
      latestTenAutotestPipelineRuns,
      latestTenDeployPipelineRuns,
    ]
  );

  const [icon, color, isRotating] = EDPCDPipelineStageKubeObject.getStatusIcon(
    stage?.status?.status
  );

  const infoColumns = [
    [
      {
        label: 'Status',
        text: (
          <Grid container spacing={1} alignItems={'center'}>
            <Grid item>
              <StatusIcon
                icon={icon}
                color={color}
                isRotating={isRotating}
                width={20}
                Title={
                  <>
                    <Typography variant={'subtitle2'} style={{ fontWeight: 600 }}>
                      {`Status: ${stage?.status?.status || 'unknown'}`}
                    </Typography>
                    {!!stage?.status?.detailed_message && (
                      <Typography variant={'subtitle2'} style={{ marginTop: rem(10) }}>
                        {stage?.status?.detailed_message}
                      </Typography>
                    )}
                  </>
                }
              />
            </Grid>
            <Grid item>
              <Typography variant={'body2'}>{stage?.status?.status || 'unknown'}</Typography>
            </Grid>
          </Grid>
        ),
      },
      {
        label: 'Trigger Type',
        text:
          stage?.spec.triggerType === TRIGGER_TYPES.MANUAL ? (
            <Chip label="manual" className={clsx([classes.labelChip, classes.labelChipBlue])} />
          ) : (
            <Chip label="auto" className={clsx([classes.labelChip, classes.labelChipGreen])} />
          ),
      },
      {
        label: 'Cluster',
        text: stage?.spec.clusterName,
      },
      {
        label: 'Namespace',
        text: stage?.spec.namespace,
      },
      {
        label: 'Description',
        text: stage?.spec.description,
        columnXs: 6,
      },
    ],
  ];

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Environments', url: { pathname: routeEDPCDPipelineList.path } },
        {
          label: CDPipelineName,
          url: {
            pathname: routeEDPCDPipelineDetails.path,
            params: {
              name: CDPipelineName,
              namespace: namespace,
            },
          },
        },
        {
          label: stageSpecName,
        },
      ]}
      headerSlot={
        <Grid container>
          <Grid item>
            <ResourceIconLink
              icon={ICONS.ARGOCD}
              tooltipTitle={'Open in ArgoCD'}
              link={LinkCreationService.argocd.createStageLink(
                EDPComponentsURLS?.argocd,
                CDPipeline?.metadata?.name,
                stageSpecName
              )}
            />
          </Grid>
          <Grid item>
            <ResourceIconLink
              icon={ICONS.GRAFANA}
              tooltipTitle={'Open in Grafana'}
              link={LinkCreationService.grafana.createDashboardLink(
                EDPComponentsURLS?.grafana,
                stage?.spec.namespace
              )}
            />
          </Grid>
          <Grid item>
            <ResourceIconLink
              icon={ICONS.KIBANA}
              tooltipTitle={'Open in Kibana'}
              link={LinkCreationService.kibana.createDashboardLink(
                EDPComponentsURLS?.kibana,
                stage?.spec.namespace
              )}
            />
          </Grid>
          <Grid item>
            <ResourceIconLink
              icon={ICONS.KUBERNETES}
              tooltipTitle={stage?.spec.clusterName}
              link={null}
            />
          </Grid>
          <Grid item style={{ marginLeft: rem(20) }}>
            <StageActions stage={stage} />
          </Grid>
        </Grid>
      }
    >
      <Section
        title={stage?.spec.name}
        description={
          'Manage, deploy, test, and troubleshoot your applications across distinct  stages.'
        }
      >
        {!!stage ? (
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ marginTop: rem(20) }}>
              <InfoColumnsAccordion title={'Stage Details'} infoRows={infoColumns} />
            </Grid>
            <Grid item xs={12}>
              <Tabs tabs={tabs} initialTabIdx={0} />
            </Grid>
          </Grid>
        ) : (
          <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
        )}
      </Section>
    </PageWrapper>
  );
};
