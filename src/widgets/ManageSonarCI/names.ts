const NAMES = {
    TOKEN: 'token',
    URL: 'url',
} as const;

export const SONAR_INTEGRATION_SECRET_FORM_NAMES = {
    [NAMES.TOKEN]: {
        name: NAMES.TOKEN,
    },
    [NAMES.URL]: {
        name: NAMES.URL,
    },
};
