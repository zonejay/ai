<template>
  <div class="message-item">
    <div class="message-header" :style="{justifyContent: msgType === MessageType.USER ? 'flex-end' : 'flex-start'}">
      <template v-if="msgType === MessageType.USER">
        <n-icon>
          <User />
        </n-icon>
      </template>
      <template v-else>
        <img class="assistant-img" src="/vite.svg" />
        <span class="loading-text" v-if="isLoading">
          智能生成中
          <span class="dot">...</span>
        </span>
      </template>
    </div>
    <div class="w-100% flex" :class="msgType === MessageType.USER ? 'justify-end' : 'justify-start'">
      <div class="max-w-72%">
        <slot v-if="!isLoading"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {User} from '@vicons/tabler'
import {MessageType} from '../constant/constant'

const props = defineProps({
  msgType: {
    type: String,
    default: MessageType.USER
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  systemName: {
    type: String,
    default: '小乐'
  },
  contentBgc: {
    type: String,
    default: '#f5f5f5'
  }
})
</script>

<style scoped lang="scss">
.message-item {
}
.message-header {
  display: flex;
  padding-bottom: 8px;
  align-items: center;
  gap: 8px;

  .user-name {
    /* font-content/l */
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
  }

  img {
    width: 20px;
    height: 20px;
  }
}
.message-content {
  user-select: text;
  padding: 8px var(--spacing-l, 12px);

  border-radius: var(--border-radius-default, 4px);
  background: v-bind(contentBgc);
}
.loading-text {
  display: flex;
  align-items: baseline;

  overflow: hidden;
  color: var(--primary-color-default, #7055ff);
  text-overflow: ellipsis;

  /* font-content/l */
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  .dot {
    /*让点垂直居中*/
    height: 1em;
    line-height: 1;
    /*让点垂直排列*/
    display: flex;
    flex-direction: column;
    /*溢出部分的点隐藏*/
    overflow: hidden;
  }
  .dot::before {
    /*三行三种点，需要搭配white-space:pre使用才能识别\A字符*/
    content: '...\A..\A.';
    white-space: pre-wrap;
    animation: dot 3s infinite step-end; /*step-end确保一次动画结束后直接跳到下一帧而没有过渡*/
  }
  @keyframes dot {
    33% {
      transform: translateY(-2em);
    }
    66% {
      transform: translateY(-1em);
    }
  }
}
</style>
