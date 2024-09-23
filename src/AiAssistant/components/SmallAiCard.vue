<template>
  <div class="small-ai-card">
    <div class="image">
      <img src="http://iph.href.lu/104x68?fg=666666&bg=cccccc" alt="" />
      <n-button theme="primary" size="mini" @click="emits('apply')">AI应用</n-button>
    </div>
    <div class="title">{{ item.title }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      title: '北欧',
      imgUrl: 'http://iph.href.lu/104x68?fg=666666&bg=cccccc',
      id: ''
    })
  },
  width: {
    type: String,
    default: '104px'
  }
})
const emits = defineEmits(['apply'])
</script>

<style scoped lang="scss">
.small-ai-card {
  width: v-bind(width);
  height: 92px;
  box-sizing: border-box;

  border: 1px solid transparent;
  border-radius: var(--border-radius-default, 4px);
  transition: border-color 0.2s cubic-bezier(0, 0, 1, 1);

  .n-btn {
    display: none;
  }
  &:hover {
    border-color: var(--primary-color-default, #7055ff);
    .n-btn {
      display: block;
    }
  }
  .image {
    height: 68px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-default, 4px);
    }

    .n-btn {
      position: absolute;
      // 居中
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .title {
    margin-top: 4px;
    overflow: hidden;
    color: var(--text-color-default, #191919);
    text-align: center;
    text-overflow: ellipsis;

    /* font-content/m */
    font-family: 'PingFang SC';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }
}
</style>
