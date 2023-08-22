import React from 'react';
import { EDP_USER_GUIDE } from '../../../../constants/urls';
import { SecretKubeObject } from '../../../../k8s/Secret';
import { SecretKubeObjectInterface } from '../../../../k8s/Secret/types';
import { getDefaultNamespace } from '../../../../utils/getDefaultNamespace';
import { ManageJiraIntegrationSecret } from '../../../../widgets/ManageJiraIntegrationSecret';
import { ConfigurationBody } from '../../components/ConfigurationBody';
import { JIRA_INTEGRATION_PAGE_DESCRIPTION } from './constants';

const findJiraIntegrationSecret = (items: SecretKubeObjectInterface[]) =>
    items?.find(el => el.metadata.name === 'jira-user');

export const PageView = () => {
    const [jiraSecret, setJiraSecret] = React.useState<SecretKubeObjectInterface>(null);

    React.useEffect(() => {
        const cancelStream = SecretKubeObject.streamJiraIntegrationSecrets({
            namespace: getDefaultNamespace(),

            dataHandler: data => {
                const jiraSecret = findJiraIntegrationSecret(data);
                setJiraSecret(jiraSecret);
            },
            errorHandler: error => {
                console.error(error);
            },
        });

        return () => {
            cancelStream();
        };
    }, []);

    const creationDisabled = React.useMemo(
        () => (jiraSecret === null ? true : !!jiraSecret),
        [jiraSecret]
    );

    const secretsArray = [jiraSecret].filter(Boolean);

    const configurationItemList = React.useMemo(
        () =>
            secretsArray.map(el => {
                const ownerReference = el?.metadata?.ownerReferences?.[0].kind;

                return {
                    id: el?.metadata?.name || el?.metadata?.uid,
                    title: el?.metadata.name,
                    ownerReference,
                    component: (
                        <ManageJiraIntegrationSecret
                            formData={{
                                isReadOnly: !!ownerReference,
                                currentElement: el,
                            }}
                        />
                    ),
                };
            }),
        [secretsArray]
    );

    return (
        <ConfigurationBody
            pageData={{
                label: JIRA_INTEGRATION_PAGE_DESCRIPTION.label,
                description: JIRA_INTEGRATION_PAGE_DESCRIPTION.description,
                docUrl: EDP_USER_GUIDE.OVERVIEW.url,
            }}
            renderPlaceHolderData={({ handleClosePlaceholder }) => ({
                title: 'Create service account',
                disabled: creationDisabled,
                component: (
                    <ManageJiraIntegrationSecret
                        formData={{
                            currentElement: 'placeholder',
                            handleClosePlaceholder,
                        }}
                    />
                ),
            })}
            items={configurationItemList}
            emptyMessage={'No Jira integration secrets found'}
        />
    );
};
