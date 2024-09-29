<script setup lang="ts">
import {darkTheme, lightTheme, useThemeVars} from 'naive-ui'
import {computed, type Ref} from 'vue'
import AiAssistant from './AiAssistant/components/AiAssistant.vue'
import {useTheme} from './AiAssistant/hook/theme.hook'
const {isDark} = useTheme()
const themeVars = useThemeVars()
const curTheme = computed(() => {
  return isDark.value ? darkTheme : lightTheme
})
</script>

<template>
  <n-config-provider :theme="curTheme">
    <n-message-provider>
      <AiAssistant :style="themeVars" />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
