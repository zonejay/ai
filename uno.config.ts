import {
  defineConfig,
  presetAttributify,
  presetUno,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  // Rules
  rules: [],

  // Shortcuts
  shortcuts: {
    btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
    'btn-green': 'text-white bg-green-500 hover:bg-green-700'
    // Add more shortcuts as needed
  },

  // Theme
  theme: {
    // Add more theme configurations as needed
  },

  // Variants
  variants: [],
  presets: [presetUno(), presetTypography(), presetAttributify()],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
