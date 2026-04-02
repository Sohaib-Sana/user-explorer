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
        bg: '#9C80FE',
        color: 'white',
        _hover: {
          bg: '#8b6ff2',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: '#c8b3ff',
        color: '#7759da',
        bg: 'white',
        _hover: {
          bg: '#f7f3ff',
        },
      },
      ghost: {
        color: '#7759da',
        _hover: {
          bg: '#f7f3ff',
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
          50: { value: '#f7f3ff' },
          100: { value: '#ede5ff' },
          200: { value: '#ddd0ff' },
          300: { value: '#c8b3ff' },
          400: { value: '#b294ff' },
          500: { value: '#9C80FE' },
          600: { value: '#8b6ff2' },
          700: { value: '#7759da' },
          800: { value: '#6247ba' },
          900: { value: '#503a97' },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: '#9C80FE' },
        primaryHover: { value: '#8b6ff2' },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
  globalCss: {
    html: {
      colorPalette: 'purple',
    },
    body: {
      colorPalette: 'purple',
    },

    /* tighten inputs/search bars */
    'input, textarea, select': {
      height: '34px',
      minHeight: '34px',
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