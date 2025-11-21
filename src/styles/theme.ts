import { LightColors, DarkColors } from './colors';
import { Typography } from './typography';
import { Spacing } from './spacing';
import { BorderRadius } from './borderRadius';
import { Shadows } from './shadows';

export interface Theme {
  colors: typeof LightColors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  isDark: boolean;
}

export const LightTheme: Theme = {
  colors: LightColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  isDark: false,
};

export const DarkTheme: Theme = {
  colors: DarkColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  isDark: true,
};

// Default theme export for direct usage in components
export const theme = {
  colors: LightColors,
  fonts: Typography.fontFamily,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
};
