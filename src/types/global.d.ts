import { PaletteColorOptions, Theme } from '@mui/material';
import { PaletteColor } from '@mui/material/styles';

declare global {
  interface ObjectConstructor {
    hasOwn(obj: object, prop: string | symbol): boolean;
  }
  interface DefaultTheme extends Theme {}
  interface Window {
    navigation: {
      canGoBack: boolean;
      back: () => Promise<void>;
    };
  }
}

declare module '*.json' {
  const dataValue: any;
  export default dataValue;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    success: PaletteColor;
    sidebarLink: {
      [propName: string]: string;
    };
    [propName: string]: any;
  }
  interface PaletteOptions {
    success?: PaletteColorOptions;
    sidebarLink: {
      [propName: string]: string;
    };
    [propName: string]: any;
  }
}

type ValueOf<T> = T[keyof T];
