import {createGlobalState, useDark, useToggle} from '@vueuse/core'

export const useTheme = createGlobalState(() => {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark
  }
})
