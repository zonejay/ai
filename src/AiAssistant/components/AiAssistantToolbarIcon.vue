<template>
  <n-tooltip content="智能AI助手" position="bottom">
    <img class="ai-paving-icon" src="/vite.svg" @click="open" />
  </n-tooltip>
</template>
<script setup>
import {openAiAssistant as open} from '@/feature/AiAssistant/hook/aiAssistant.hook.ts'
</script>
<style lang="scss" scoped>
.ai-paving-icon {
  margin: 0 -6px;
  cursor: pointer;
}
</style>
