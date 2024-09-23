<script setup lang="ts">
import {darkTheme, lightTheme} from 'naive-ui'
import {useDark, useToggle} from '@vueuse/core'
import {computed, type Ref} from 'vue'
import AiAssistant from './AiAssistant/components/AiAssistant.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const curTheme = computed(() => {
  return isDark.value ? darkTheme : lightTheme
})
</script>

<template>
  <!-- <n-config-provider :theme="curTheme"> -->
  <n-message-provider>
    <AiAssistant />
  </n-message-provider>
  <!-- </n-config-provider> -->
</template>

<style scoped></style>
