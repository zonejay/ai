<template>
  <common-right-pop title="猜你喜欢" :trigger-props="triggerProps">
    <template #trigger="{visible}">
      <n-tooltip content="猜你喜欢" position="bottom">
        <n-button size="mini" :type="visible ? 'fill' : 'text'">
          <template #icon>
            <n-icon name="GuessLike" />
          </template>
        </n-button>
      </n-tooltip>
    </template>
    <div class="card-list">
      <small-ai-card />
      <small-ai-card />
      <small-ai-card />
      <small-ai-card />
      <small-ai-card />
      <small-ai-card />
      <small-ai-card />
    </div>
  </common-right-pop>
</template>

<script setup lang="ts">
import CommonRightPop from './CommonRightPop.vue'
import SmallAiCard from './SmallAiCard.vue'
const triggerProps = {
  'popup-translate': [94, 0],
  'click-outside-to-close': false
}
</script>

<style scoped lang="scss">
.card-list {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
