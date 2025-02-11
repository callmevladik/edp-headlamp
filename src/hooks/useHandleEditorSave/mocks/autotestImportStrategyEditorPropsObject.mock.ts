export const autotestImportStrategyEditorPropsObjectMock = [
    {
        apiVersion: 'v2.edp.epam.com/v1',
        kind: 'Codebase',
        spec: {
            type: 'autotest',
            strategy: 'import',
            gitServer: 'gerrit',
            ciTool: 'tekton',
            defaultBranch: 'master',
            description: 'autotest description',
            lang: 'Java',
            framework: 'java11',
            buildTool: 'maven',
            testReportFramework: 'allure',
            versioning: {
                type: 'edp',
                startFrom: '0.0.0-SNAPSHOT',
            },
            jiraServer: 'epam-jira',
            commitMessagePattern: '^\\[PROJECT_NAME-\\d{4}\\]:.*$',
            ticketNamePattern: 'PROJECT_NAME-\\d{4}',
            jiraIssueMetadataPayload:
                '{"components":"test1","fixVersions":"test2","labels":"test3"}',
            gitUrlPath: 'https://git.epam.com/epmd-edp/examples/3tier/3-tier-app-be.git',
        },
        metadata: {
            name: 'test',
        },
    },
];

export const autotestImportStrategyEditorPropsObjectMockExpectedOutput = {
    type: 'autotest',
    strategy: 'import',
    gitServer: 'gerrit',
    ciTool: 'tekton',
    defaultBranch: 'master',
    description: 'autotest description',
    lang: 'Java',
    framework: 'java11',
    buildTool: 'maven',
    testReportFramework: 'allure',
    versioningType: 'edp',
    versioningStartFrom: '0.0.0-SNAPSHOT',
    jiraServer: 'epam-jira',
    commitMessagePattern: '^\\[PROJECT_NAME-\\d{4}\\]:.*$',
    ticketNamePattern: 'PROJECT_NAME-\\d{4}',
    jiraIssueMetadataPayload: '{"components":"test1","fixVersions":"test2","labels":"test3"}',
    gitUrlPath: 'https://git.epam.com/epmd-edp/examples/3tier/3-tier-app-be.git',
    name: 'test',
};
