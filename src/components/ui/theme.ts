import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from '@chakra-ui/react';

const buttonRecipe = defineRecipe({
  base: {
    borderRadius: '10px',
    fontWeight: '500',
  },
  variants: {
    variant: {
      solid: {
        bg: '{colors.brand.500}',
        color: 'white',
        _hover: {
          bg: '{colors.brand.600}',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: '{colors.brand.300}',
        color: '{colors.brand.700}',
        bg: 'white',
        _hover: {
          bg: '{colors.brand.50}',
        },
      },
      ghost: {
        color: '{colors.brand.700}',
        _hover: {
          bg: '{colors.brand.50}',
        },
      },
    },
    size: {
      sm: {
        h: '30px',
        minW: '30px',
        px: '10px',
        textStyle: 'sm',
      },
      md: {
        h: '34px',
        minW: '34px',
        px: '14px',
        textStyle: 'sm',
      },
      lg: {
        h: '38px',
        minW: '38px',
        px: '16px',
        textStyle: 'md',
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#ecfeff' },
          100: { value: '#cffafe' },
          200: { value: '#a5f3fc' },
          300: { value: '#67e8f9' },
          400: { value: '#22d3ee' },
          500: { value: '#06b6d4' },
          600: { value: '#0891b2' },
          700: { value: '#0e7490' },
          800: { value: '#155e75' },
          900: { value: '#164e63' },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: '#06b6d4' },
        primaryHover: { value: '#0e7490' },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
  globalCss: {
    html: {
      colorPalette: 'brand',
    },
    body: {
      colorPalette: 'brand',
      color: 'gray.800',
    },
    label: {
      color: 'gray.800',
    },

    /* tighten inputs/search bars */
    'input, textarea, select': {
      height: '34px',
      minHeight: '34px',
      color: 'black',
    },

    'input::placeholder, textarea::placeholder': {
      color: 'gray.500',
      opacity: 1,
    },

    '::selection': {
      backgroundColor: 'brand.500',
      color: 'white',
    },

    '[data-part="start-element"], [data-part="end-element"]': {
      height: '34px',
    },

    '[data-part="start-element"] svg, [data-part="end-element"] svg': {
      width: '14px',
      height: '14px',
    },
  },
});

export const system = createSystem(defaultConfig, config);