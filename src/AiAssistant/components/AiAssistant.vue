<template>
  <div
    class="ai-assistant flex bg-white"
    @drop.prevent="handleDrop"
    @dragleave.prevent="handleDragleave"
    @dragover.prevent="handleDragover"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    tabindex="0"
    ref="assistantRef"
  >
    <div class="assis-side flex flex-col bg-gray-100 bg-opacity-50 w-60">
      <div class="assis-header flex justify-between pa-3 b-0 b-b-1 b-coolGray b-solid">
        <div class="left">
          <span class="title text-black">智能AI助手</span>
          <n-badge value="New" />
        </div>
        <div class="right">
          <n-button strong secondary circle size="small">
            <template #icon>
              <n-icon>
                <DoorExit />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <div class="assis-content flex-1">
      <div class="assis-chat-list">
        <n-scrollbar ref="scrollRef">
          <div class="list-wrapper px-16rem py-0" ref="listRef">
            <template v-for="(item, index) in mockMessages" :key="index">
              <MessageWrapper :item="item" />
            </template>
            <MessageItem v-if="isLoading" msg-type="assistant" :is-loading="true" />
            <div class="last-div" style="height: 12px"></div>
          </div>
        </n-scrollbar>
      </div>
      <div class="assis-footer p-x-20 box-border">
        <div class="text-input">
          <n-input
            type="textarea"
            placeholder="请输入精装风格及要求，如：北欧风格含大理石背景墙"
            :auto-size="{maxRows: 11}"
            v-model:value="userInput"
            @keydown="handleKeydown"
          />
          <n-button theme="primary" circle size="mini" class="smaller-button" @click="scrollToBottom">
            <template #icon>
              <n-icon name="BackTop" color="white" />
            </template>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, ref, unref} from 'vue'
import MessageItem from './MessageItem.vue'
import {useMessage, type UploadInst} from 'naive-ui'
import {DoorExit, Heart} from '@vicons/tabler'
import {getOneMessage, mockMessages, useStreamOutput} from '../mock'
import MessageWrapper from './MessageWrapper.vue'
import {MessageType} from '../constant/constant'
import {checkFolder} from '../hook/aiAssistant.hook'
import {useScroll} from '../hook/scroll.hook'

const Message = useMessage()

const activeTab = ref('image')
const msgList = ref<any[]>([])
const isLoading = ref(false)

function switchToImgTab() {
  if (activeTab.value === 'text') {
    activeTab.value = 'image'
  }
}

// 列表滚动
// 发送消息后需要滚动到列表底部
const {scrollRef, listRef, scrollToBottom} = useScroll()

// 图片上传
// 图片最大上传数量20张
const maxUploadCount = 20
const fileList = ref([
  {
    uid: 1,
    url: 'https://n-private-pre-1312190317.cos.ap-guangzhou.myqcloud.com/houseType/showImg/ht/1833093821305421824/png.1833093821305421824?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKID1xjaR4Uq4LVSH8xgYN4e8QaXKtEkI4iA%26q-sign-time%3D1725954223%3B1726040623%26q-key-time%3D1725954223%3B1726040623%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3Dd3dbaaf822845f60c6f702b1b9c8930bafb9dc71',
    name: 'a.webp',
    status: 'success'
  },
  {
    uid: 2,
    url: 'https://n-private-pre-1312190317.cos.ap-guangzhou.myqcloud.com/houseType/showImg/ht/1833093821305421824/png.1833093821305421824?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKID1xjaR4Uq4LVSH8xgYN4e8QaXKtEkI4iA%26q-sign-time%3D1725954223%3B1726040623%26q-key-time%3D1725954223%3B1726040623%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3Dd3dbaaf822845f60c6f702b1b9c8930bafb9dc71',
    name: 'b.webp',
    status: 'error'
  }
])
const uploadRef = ref<UploadInst | null>(null)
const imgUploadRef = ref<HTMLInputElement | null>(null)

// 粘贴处理
// 浏览器无法读取剪贴板中的多张图片，当剪贴板有多张图片时，getAsFile返回null
// 鼠标移入移出
const assistantRef = ref<HTMLDivElement | null>(null)
const isInAssistant = ref(false)
function handleMouseEnter() {
  isInAssistant.value = true
}
function handleMouseLeave() {
  isInAssistant.value = false
}
async function handlePaste(e: ClipboardEvent) {
  if (isInAssistant.value || assistantRef.value!.contains(document.activeElement)) {
    switchToImgTab()
    const items = e.clipboardData?.items
    let file: File | null = null
    try {
      if (!items || 0 === items.length) return
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          file = items[i].getAsFile()
          break
        }
      }
      console.log(file)
      if (file) {
        uploadRef.value?.upload([file])
      }
    } catch (error) {}
  }
}
onMounted(() => {
  document.addEventListener('paste', handlePaste)
})
onBeforeMount(() => {
  document.removeEventListener('paste', handlePaste)
})

// 图片拖拽上传
const dragOver = ref(false)
let dragTimer: NodeJS.Timeout
async function handleDrop(e: DragEvent) {
  e.preventDefault()
  const files: FileList | undefined = e.dataTransfer?.files
  dragOver.value = false
  const isFolder = await checkFolder(e)
  isFolder ? Message.warning('暂不支持文件夹上传') : transferFiles(files)
}
function handleDragleave(e) {
  dragTimer = setTimeout(() => {
    dragOver.value = false
  }, 100)
}
function handleDragover(e) {
  clearTimeout(dragTimer)
  dragOver.value = true
}
function uploadFile(e) {
  imgUploadRef.value?.click()
}
function transferFiles(files: FileList | undefined) {
  if (!files) return
  if (fileList.value.length + files?.length > maxUploadCount) {
    Message.warning(`最多上传${maxUploadCount}张图片`)
  } else if (files && files.length > 0) {
    switchToImgTab()
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      file.uid = Date.now() + i + ''
      uploadRef.value?.upload([file])
    }
  }
}

function handleFileChange(e: Event) {
  const target = e?.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadRef.value?.upload([file])
  }
}
function beforeUpload(file: File) {
  const typeList = ['png', 'jpg', 'jpeg']
  return new Promise((resolve, reject) => {
    if (!typeList.some((type) => file.type.includes(type))) {
      Message.error('请上传格式为.png,.jpeg,.jpg的图片')
      reject()
    }
    if (file.size > 5242880) {
      Message.error('文件大小不大于5M')
      reject()
    }
    resolve(true)
  })
}

// 文字输入
const userInput = ref('')
function handleOp(item, opType: 'add' | 'delete' = 'add') {
  console.log(item, opType)
  if (opType === 'add') {
    if (!userInput.value) {
      userInput.value = item
    } else {
      userInput.value += `、${item}`
    }
  }
}

// shift+enter换行 enter发送
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      // Shift + Enter: 插入换行
      return
    } else {
      // Enter: 发送消息
      event.preventDefault() // 防止换行
      submit()
    }
  }
}

// 猜你喜欢
const showLike = ref(false)
function toggleShowLike() {
  showLike.value = !showLike.value
}

// 信息发送
function submit() {
  if (isLoading.value) {
    Message.warning('智能生成中，请稍后再发送')
    return
  }
  if (activeTab.value === 'text') {
    sendTextMsg()
  }
  if (activeTab.value === 'image') {
    sendImgMsg()
  }
}

// 发送文字
async function sendTextMsg() {
  if (!userInput.value) {
    Message.warning('请输入内容')
    return
  }
  scrollToBottom()
  try {
    isLoading.value = true
    const input = unref(userInput)
    userInput.value = ''
    addUserMsg(input)
    // 同步非流式
    // const msg = await getOneMessage(input);
    // 同步流式调用
    const {getStreamMessage, ret} = useStreamOutput(isLoading)
    msgList.value.push(ret)
    await getStreamMessage(input)
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

// 发送图片
function sendImgMsg() {
  if (fileList.value.length === 0) {
    Message.warning('请上传图片')
    return
  }
  scrollToBottom()
}

// 添加用户消息
function addUserMsg(msg) {
  const ret = {
    // 创建人
    creater: '火山',
    // 当前消息场景
    scene: '文生图片',
    // 内容
    content: [
      {
        type: 'p',
        children: msg
      }
    ]
  }
  msgList.value.push(ret)
}
</script>

<style scoped lang="scss">
.ai-assistant {
  height: 100%;

  // user-select: none 会屏蔽paste事件
  user-select: text;
  &:focus {
    outline: none;
  }

  .assis-header {
    .left,
    .right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title {
      font-size: 16px;
      font-weight: bold;
    }

    :deep(.n-badge-text) {
      background: linear-gradient(286deg, #ff375e 0%, #ff8373 100%);
      line-height: 18px;
    }

    ::selection {
      background: transparent; /* 设置为透明 */
      color: inherit; /* 保持文字颜色 */
    }
  }

  .assis-content {
    display: flex;
    padding: var(--spacing-l, 12px) var(--spacing-l, 12px) 20px var(--spacing-l, 12px);
    flex-direction: column;
    align-items: center;
    flex: 1;
    align-self: stretch;

    overflow: hidden;

    .assis-chat-list {
      flex: 1;
      overflow: hidden;
      height: 100%;
      width: calc(100%);
      .list-wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl, 16px);
      }

      :deep(.n-scrollbar-thumb-bar) {
        margin-left: 6px;
      }
    }

    .assis-footer {
      position: relative;
      width: 100%;
      .select-input-type {
        z-index: 2;
        position: absolute;
        top: 0px;
        right: 0px;
      }
      :deep(.n-tabs-rail) {
        @apply w-48;
      }
      .text-input {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        padding-right: 12px;
        margin: 1px;
        border: 1px solid transparent;
        border-radius: var(--border-radius-default, 4px);
        background: var(--fill-color-lighter-6, #f5f5f5);
        transition: color 0.1s cubic-bezier(0, 0, 1, 1), border-color 0.1s cubic-bezier(0, 0, 1, 1),
          background-color 0.1s cubic-bezier(0, 0, 1, 1);

        .n-btn {
          margin-bottom: 12px;
        }
        .n-textarea-wrapper {
          flex: 1;
          border: none;

          :deep(.n-textarea) {
            padding: 12px;
          }
        }
        &:hover {
          background-color: var(--operate-bg);
          .n-textarea-wrapper {
            background-color: var(--operate-bg);
          }
        }
        &:focus-within {
          border: 1px solid var(--primary-color-default, #7055ff);
          background: var(--fill-color-white, #fff);
          .n-textarea-wrapper {
            background: var(--fill-color-white, #fff);
          }
        }
      }

      .image-upload {
        $img-size: 48px;

        padding: 12px;

        border-radius: var(--border-radius-default, 4px);
        border: 1px solid transparent;
        border-radius: var(--border-radius-default, 4px);
        background: var(--fill-color-lighter-6, #f5f5f5);

        transition: color 0.1s cubic-bezier(0, 0, 1, 1), border-color 0.1s cubic-bezier(0, 0, 1, 1),
          background-color 0.1s cubic-bezier(0, 0, 1, 1);

        &:hover {
          background-color: var(--operate-bg);
          .n-input-wrapper {
            background-color: var(--operate-bg);
          }
        }

        &:focus-within {
          border-color: var(--primary-color-default, #7055ff);
          background-color: #fff;
          .n-input-wrapper {
            background-color: #fff;
          }
        }

        .n-upload-wrapper {
          margin-bottom: 12px;
          :deep(.n-upload-list-picture) {
            width: $img-size;
            height: $img-size;
            line-height: $img-size;
            .n-upload-list-picture-mask {
              line-height: $img-size;

              &:hover .n-upload-list-picture-operation {
                margin-top: 28px;
              }
              &:hover .n-upload-list-picture-operation:has(.n-upload-icon-remove) {
                margin-top: 0;
              }
              .n-upload-icon-error {
                svg {
                  width: $img-size;
                  height: $img-size;
                  vertical-align: top;
                }
              }
            }

            .n-upload-picture-card {
              height: $img-size;
              min-width: $img-size;
            }
            .n-upload-list-picture-operation:has(.n-upload-icon-remove) {
              position: absolute;
              top: 0;
              right: 0;

              border-bottom-left-radius: 4px;
              height: 14px;
            }
            .n-upload-icon-remove {
              svg {
                width: 14px;
                height: 14px;
                font-size: 12px;
              }
            }
          }
        }
        .n-input-wrapper {
          padding: 0px;
          border: none;
        }
      }
    }
  }
}
.smaller-button {
  width: 20px;
  height: 20px;
}
</style>
