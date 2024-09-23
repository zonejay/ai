<template>
  <n-popover
    position="rt"
    :show-arrow="false"
    trigger="click"
    :trigger-props="localPopProps"
    class="common-right-popover"
    v-model:popup-visible="visible"
    popup-container=".ai-assistant"
  >
    <template #trigger>
      <slot name="trigger" :visible="visible"></slot>
    </template>
    <template #default>
      <div class="pop__content">
        <div class="pop__header">
          <span>{{ title }}</span>
          <n-button size="mini" type="text" @click="handleClose">
            <template #icon>
              <n-icon name="Close" />
            </template>
          </n-button>
        </div>
        <div class="pop__list">
          <slot></slot>
        </div>
      </div>
    </template>
  </n-popover>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  triggerProps: {
    type: Object,
    default: () => ({'popup-translate': [60, 0], 'click-outside-to-close': true})
  }
})

const localPopProps = computed(() => {
  return {
    'popup-translate': [60, 0],
    'click-outside-to-close': true,
    ...props.triggerProps
  }
})

const visible = ref(false)
function handleClose() {
  visible.value = false
}
</script>

<style scoped lang="scss">
$pd: 12px;
:global(.common-right-popover .n-popover-content) {
  margin-top: 0;
}
:global(.common-right-popover .n-popover-popup-content) {
  padding: 0;
  border-bottom: 1px solid var(--border-color-lighter-5);
  border-left: 1px solid var(--border-color-lighter-5);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: none;
}
.pop__content {
  width: 240px;
  padding: $pd 0;

  .pop__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0 $pd $pd;
    border-bottom: 1px solid var(--border-color-lighter-5);

    span {
      overflow: hidden;
      color: var(--text-color-default, #191919);
      text-overflow: ellipsis;

      /* font-title/m */
      font-family: 'PingFang SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 22px; /* 157.143% */
    }
  }
  .pop__list {
    margin-top: $pd;
    margin-left: $pd;
    margin-right: $pd;
    height: 797px;
  }
}
</style>
