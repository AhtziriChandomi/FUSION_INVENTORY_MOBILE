import { MD3LightTheme } from 'react-native-paper';
import * as constant from '../constants/Constants';

/**
 * Tema de la app con la paleta de la plataforma web
 */
export const theme = {
  ...MD3LightTheme,
  roundness: 4,                       // 0.25rem, como los botones e inputs de la web

  colors: {
    ...MD3LightTheme.colors,

    // Botones principales en el azul oscuro de la web ($brand-background / menú)
    "primary": "#3f4d67",
    "onPrimary": "#ffffff",
    "primaryContainer": "#e4e8ef",
    "onPrimaryContainer": "#2b3547",

    // Azul de la web, disponible como colors.accent para detalles
    "accent": "#04a9f5",              // $primary-color

    "secondary": "#748892",           // $secondary-color
    "onSecondary": "#ffffff",
    "secondaryContainer": constant.secondaryContainer,
    "onSecondaryContainer": "#1d262b",

    "error": "#f44236",               // $danger-color
    "onError": "#ffffff",
    "errorContainer": constant.errorContainer,
    "onErrorContainer": "#600e0a",

    "background": "#f4f7fa",          // $theme-background
    "surface": "#ffffff",
    "onSurface": "#37474f",           // $dark-color
    "onSurfaceVariant": "#748892",
    "outline": "#d6d6d6",             // $default-color

    "outlineVariant": "#eaeaea",      // $theme-border
    "surfaceVariant": "#f2f2f2",      // $light-color
    "tertiaryContainer": "#ede7f6",
    "onTertiaryContainer": "#5e35b1",

    "success": "#1de9b6",             // $success-color
    "onSuccess": "#ffffff",
    "successContainer": constant.successContainer,
    "onSuccessContainer": "#0b6b53",

    "warning": "#f4c22b",             // $warning-color
    "onWarning": "#ffffff",
    "warningContainer": constant.warningContainer,
    "onWarningContainer": "#7d6608",

    "info": "#3ebfea",                // $info-color
    "onInfo": "#ffffff",
    "infoContainer": "#e1f5fe",
    "onInfoContainer": "#01579b",

    "purple": "#a389d4",              // $purple-color
    "onPurple": "#ffffff",

    "dark": "#37474f",                // $dark-color
    "default": "#d6d6d6",             // $default-color
    "light": "#f2f2f2",               // $light-color

    // Textos y bordes de la web
    "heading": "#111111",             // $theme-heading-color
    "text": "#888888",                // $theme-font-color
    "border": "#eaeaea",              // $theme-border
    "formBg": "#f0f3f6",              // $form-bg
    "brand": "#3f4d67",               // $brand-background (header / menú)

    "cian": "#006874",
    "cianContainer": "#dbe4e6",

    "elevation": {
      "level0": "transparent",
      "level1": "#f5f5f6",
      "level2": "#f0f1f3",
      "level3": "#ebedef",
      "level4": "#e6e8eb",
      "level5": "#e1e4e8"
    },
  },
};