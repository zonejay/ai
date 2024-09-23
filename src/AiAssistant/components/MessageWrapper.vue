<template>
  <MessageItem :msg-type="msgType">
    <template v-for="content in item.content" :key="content.type">
      <template v-if="content.type === 'images' && msgType === MessageType.USER">
        <div class="user-img-list">
          <img src="http://iph.href.lu/48x48?fg=666666&bg=cccccc" alt="" v-for="i in 12" :key="i" />
        </div>
      </template>
      <template v-else>
        <div class="content">
          <div class="carousel-wrapper" v-if="content.type === 'images'">
            <n-carousel
              :style="{
                width: '432px',
                height: '240px'
              }"
              v-model:current-index="curImageIndex"
              indicator-type="never"
              :show-arrow="true"
              :show-dots="false"
            >
              <n-carousel-item v-for="image in images" :key="image">
                <n-image
                  :src="image"
                  :style="{
                    width: '100%',
                    height: '100%'
                  }"
                />
              </n-carousel-item>
            </n-carousel>
            <div class="img-actions">
              <div class="img-index bg" v-if="images.length > 1">{{ curImageIndex }}/{{ images.length }}</div>
              <div class="img-op bg">
                <n-button size="tiny" @click="downloadImg">
                  <template #icon>
                    <n-icon name="DownloadSmall" color="white">
                      <Download />
                    </n-icon>
                  </template>
                </n-button>
                <n-button size="tiny" @click="copyImg">
                  <template #icon>
                    <n-icon color="white">
                      <Copy />
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </div>
          </div>
          <div class="text" v-if="content.type === 'p'">{{ content.children }}</div>
        </div>
      </template>
    </template>
  </MessageItem>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {MessageType} from '../constant/constant'
import MessageItem from './MessageItem.vue'
import {useMessage} from 'naive-ui'
import {downloadFileByBlob} from '../hook/aiAssistant.hook'
import {Copy, Download} from '@vicons/tabler'
const Message = useMessage()
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {
        creater: '',
        scene: '',
        content: [
          {
            type: 'images',
            props: {
              images: []
            }
          }
        ]
      }
    }
  }
})
const msgItem = computed(() => {
  return props.item.content[0]
})
const msgType = computed(() => {
  return props.item.creater === 'assistant' ? MessageType.ASSISTANT : MessageType.USER
})
const isUser = computed(() => {
  return msgItem.value.type === 'images' && msgType.value === MessageType.USER
})

const curImageIndex = ref(1)
const images = [
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
  'https://n-private-pre-1312190317.cos.ap-guangzhou.myqcloud.com/houseType/showImg/ht/1834140220449181696/png.1834140220449181696?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKID1xjaR4Uq4LVSH8xgYN4e8QaXKtEkI4iA%26q-sign-time%3D1726209376%3B1726295776%26q-key-time%3D1726209376%3B1726295776%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D04f43b0352d392cc7fcd2a22bfbac261905f9965'
]

async function downloadImg() {
  console.log('downloadImg')
  const imageUrl = images[curImageIndex.value - 1]
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) throw new Error('网络错误')

    const imgType = response.headers.get('content-type')?.split('/')[1] || 'png'

    const blob = await response.blob()
    downloadFileByBlob(blob, `downloaded_image.${imgType}`)
  } catch (error) {
    console.log('下载失败:', error)
  }
}

async function copyImg() {
  // 将图片复制到系统剪贴板
  const imageUrl = images[curImageIndex.value - 1]

  try {
    const response = await fetch(imageUrl)
    if (!response.ok) throw new Error('网络错误')

    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'image/png'
    const item = new ClipboardItem({[contentType]: blob})

    await navigator.clipboard.write([item])
    Message.success('图片已复制到剪贴板！')
  } catch (error) {
    Message.error('复制图片失败，请检查链接是否有效。')
  }
}
</script>

<style lang="scss" scoped>
.user-img-list {
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 8px;
  flex-wrap: wrap;

  img {
    border-radius: var(--border-radius-default, 4px);
    width: 48px;
    height: 48px;
  }
}
.content {
  user-select: text;
  padding: 8px var(--spacing-l, 12px);

  border-radius: var(--border-radius-default, 4px);
  background: var(--fill-color-lighter-6, #f5f5f5);

  .text {
    color: var(--text-color-default, #191919);
    text-align: justify;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
  }

  .carousel-wrapper {
    position: relative;
    img {
      border-radius: var(--border-radius-default, 4px);
    }
    :deep(.n-carousel-arrow) {
      & > div {
        width: 32px;
        height: 32px;
        background: rgba(0, 0, 0, 0.2);

        svg {
          font-size: 16px;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }

      .n-carousel-arrow-left {
        left: 16px;
      }

      .n-carousel-arrow-right {
        right: 16px;
      }
    }
    :deep(.n-image) {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .img-actions {
      z-index: 1;
      position: absolute;
      right: 8px;
      top: 8px;
      display: flex;
      align-items: center;
      gap: 4px;

      .bg {
        display: flex;
        padding: var(--spacing-s, 4px);
        justify-content: center;

        border-radius: var(--border-radius-default, 4px);
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);

        gap: 4px;
      }

      .img-index {
        color: var(--text-color-white, #fff);

        /* font-title/s */
        font-family: 'PingFang SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px; /* 166.667% */
      }

      .img-op {
        .n-btn {
          width: 20px;
          height: 20px;

          background: rgba(0, 0, 0, 0);
          color: red;
        }
      }
    }
  }
}
</style>
