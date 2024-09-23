<template>
  <message-item
    :system-name="'小乐猜你喜欢'"
    :content-bgc="'#fff'"
    :msg-type="MessageType.ASSISTANT"
  >
    <div class="card-list">
      <SmallAiCard width="108px" v-for="item in 8" :key="item" @apply="handleApply(item)" />
    </div>
  </message-item>
</template>

<script setup lang="ts">
import { MessageType } from '../constant/constant';
import MessageItem from './MessageItem.vue';
import SmallAiCard from './SmallAiCard.vue';

const props = defineProps({
  likeList: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(['apply']);
function handleApply(item) {
  emits('apply', item);
}
</script>

<style scoped lang="scss">
.card-list {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
