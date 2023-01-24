import { extendTheme } from 'native-base'

export const theme = extendTheme({
  colors: {
    white: '#fff',

    gray: {
      100: '#e1e1e6',
      200: '#c4c4cc',
      300: '#7c7c8a',
      400: '#323238',
      500: '#29292e',
      600: '#202024',
      700: '#121214',
    },
    red: {
      500: '#f75a68',
    },

    indigo: {
      500: '#818cf8',
      700: '#4f46e5',
    },
  },
  fonts: {
    body: 'Roboto_400Regular',
    heading: 'Roboto_700Bold',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  sizes: {
    14: 56,
    33: 148,
  },
})
