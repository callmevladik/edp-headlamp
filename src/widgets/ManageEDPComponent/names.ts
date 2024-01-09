const NAMES = {
  ICON: 'icon',
  NAME: 'name',
  URL: 'url',
} as const;

export const EDP_COMPONENT_FORM_NAMES = {
  [NAMES.ICON]: {
    name: NAMES.ICON,
    path: ['spec', 'icon'],
  },
  [NAMES.NAME]: {
    name: NAMES.NAME,
    path: ['spec', 'type'],
  },
  [NAMES.URL]: {
    name: NAMES.URL,
    path: ['spec', 'url'],
  },
};
