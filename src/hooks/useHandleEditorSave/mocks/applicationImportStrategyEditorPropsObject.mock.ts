export const applicationImportStrategyEditorPropsObjectMock = [
    {
        apiVersion: 'v2.edp.epam.com/v1',
        kind: 'Codebase',
        spec: {
            type: 'application',
            strategy: 'import',
            gitServer: 'gerrit',
            ciTool: 'tekton',
            emptyProject: false,
            defaultBranch: 'master',
            lang: 'Java',
            framework: 'java11',
            buildTool: 'gradle',
            versioning: {
                type: 'edp',
                startFrom: '0.0.0-SNAPSHOT',
            },
            deploymentScript: 'helm-chart',
            jiraServer: 'epam-jira',
            commitMessagePattern: '^\\[PROJECT_NAME-\\d{4}\\]:.*$',
            ticketNamePattern: 'PROJECT_NAME-\\d{4}',
            jiraIssueMetadataPayload:
                '{"components":"test1","fixVersions":"test2","labels":"test3"}',
            gitUrlPath: 'https://git.epam.com/epmd-edp/examples/3tier/3-tier-app-be.git',
        },
        metadata: {
            name: 'tests',
        },
    },
];

export const applicationImportStrategyEditorPropsObjectMockExpectedOutput = {
    type: 'application',
    strategy: 'import',
    gitServer: 'gerrit',
    ciTool: 'tekton',
    emptyProject: false,
    defaultBranch: 'master',
    lang: 'Java',
    framework: 'java11',
    buildTool: 'gradle',
    versioningType: 'edp',
    versioningStartFrom: '0.0.0-SNAPSHOT',
    deploymentScript: 'helm-chart',
    jiraServer: 'epam-jira',
    commitMessagePattern: '^\\[PROJECT_NAME-\\d{4}\\]:.*$',
    ticketNamePattern: 'PROJECT_NAME-\\d{4}',
    jiraIssueMetadataPayload: '{"components":"test1","fixVersions":"test2","labels":"test3"}',
    gitUrlPath: 'https://git.epam.com/epmd-edp/examples/3tier/3-tier-app-be.git',
    name: 'tests',
};
