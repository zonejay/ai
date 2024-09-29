<template>
  <n-space vertical>
    <n-layout has-sider style="height: 100vh">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <!-- <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :render-icon="renderMenuIcon"
          :expand-icon="expandIcon"
        /> -->
        <div class="assis-side flex flex-col bg-opacity-50 w-60">
          <div class="assis-header flex justify-between pa-3 b-0 b-b-1 b-coolGray b-solid">
            <div class="left">
              <span class="title" style="color: var(--n-color-text)"></span>
              <n-badge value="New" />
            </div>
            <div class="right">
              <n-button @click="toggleDark()">切换主题{{ isDark }}</n-button>
              <n-button strong secondary circle size="small" @click="showSetting = true">
                <template #icon>
                  <n-icon>
                    <Settings />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
          <span>{{ isGeminiAvailable }}</span>
        </div>
      </n-layout-sider>
      <n-layout>
        <div class="ai-assistant" tabindex="0" ref="assistantRef">
          <div class="assis-content flex-1 h-100% box-border">
            <div class="assis-chat-list">
              <n-scrollbar ref="scrollRef">
                <div class="list-wrapper px-16rem py-0" ref="listRef">
                  <template v-for="(item, index) in msgList" :key="index">
                    <MessageWrapper :item="item" />
                  </template>
                  <MessageItem v-if="isLoading" msg-type="assistant" :is-loading="true" />
                  <div class="last-div" style="height: 12px"></div>
                </div>
              </n-scrollbar>
            </div>
            <div class="assis-footer w-66% box-border">
              <div class="text-input">
                <n-input
                  type="textarea"
                  placeholder="请输入精装风格及要求，如：北欧风格含大理石背景墙"
                  :auto-size="{maxRows: 11}"
                  v-model:value="userInput"
                  @keydown="handleKeydown"
                />
                <n-button theme="primary" circle size="small" class="smaller-button" @click="submit">
                  <template #icon>
                    <n-icon>
                      <Send />
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </n-layout>
    </n-layout>
  </n-space>
  <!-- 设置llm api 和 key -->
  <n-modal
    v-model:show="showSetting"
    preset="dialog"
    title="设置"
    positive-text="保存"
    negative-text="取消"
    @positive-click="handleSave"
    @negative-click="handleCancel"
  >
    <n-form>
      <n-form-item label="模型选择">
        <n-select v-model:value="form.api" />
      </n-form-item>
      <n-form-item label="API">
        <n-input v-model:value="form.api" />
      </n-form-item>
      <n-form-item label="Key">
        <n-input v-model:value="form.key" type="password" show-password-on="click" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, Ref, ref, unref} from 'vue'
import MessageItem from './MessageItem.vue'
import {useMessage} from 'naive-ui'
import {Heart, Send, Settings} from '@vicons/tabler'
import {mockMessages} from '../mock'
import MessageWrapper from './MessageWrapper.vue'
import {useScroll} from '../hook/scroll.hook'
import {useDark, useToggle} from '@vueuse/core'
import {useGemini} from '../hook/gemini.hook'
const isDark: Ref<boolean> = useDark()
const toggleDark = useToggle(isDark)
const collapsed = ref(false)

const Message = useMessage()

const form = ref({
  api: '',
  key: ''
})
const showSetting = ref(false)
function handleSave() {
  console.log(form.value)
}
function handleCancel() {
  console.log('cancel')
  showSetting.value = false
}

const msgList = ref<any[]>([])
const isLoading = ref(false)

// 列表滚动
// 发送消息后需要滚动到列表底部
const {scrollRef, listRef, scrollToBottom} = useScroll()

// 粘贴处理
// 浏览器无法读取剪贴板中的多张图片，当剪贴板有多张图片时，getAsFile返回null
// 鼠标移入移出
const assistantRef = ref<HTMLDivElement | null>(null)

// 文字输入
const userInput = ref('')

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

// 信息发送
function submit() {
  if (isLoading.value) {
    Message.warning('智能生成中，请稍后再发送')
    return
  }
  sendTextMsg()
}
const {isAvailable, startSession} = useGemini()
const isGeminiAvailable = computed(() => {
  return isAvailable.value ? 'gemini is ready' : 'gemini is not ready'
})
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
    const ret = await startSession(unref(input), unref(msgList))
    addAssistantMsg(ret)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

// 添加用户消息
function addUserMsg(content: string) {
  const ret = {
    // 创建人
    creater: '火山',
    // 当前消息场景
    scene: '文生图片',
    role: 'user',
    // 内容
    content
  }
  msgList.value.push(ret)
}

// 添加assistant消息
function addAssistantMsg(content: string) {
  const ret = {
    // 创建人
    creater: 'Gemni Nano',
    // 当前消息场景
    scene: '文生图片',
    role: 'assistant',
    // 内容
    content
  }
  msgList.value.push(ret)
}
const a = [{"creater":"火山","scene":"文生图片","role":"user","content":"hello"},
{"creater":"Gemni Nano","scene":"文生图片","role":"assistant","content":" Hello!"},
{"creater":"火山","scene":"文生图片","role":"user","content":"create a web page use vue 3 with vue SFC"},
{"creater":"Gemni Nano","scene":"文生图片","role":"assistant","content":" ```html\n<!-- src/App.vue -->\n<template>\n  <div>\n    <h1>{{ this.$router.breadCrumb }}</div>\n    <router-view/>\n  </div>\n</template>\n\n<script>\nimport Vue from 'vue';\nimport VueRouter from 'vue-router';\nimport Vuex from 'vuex';\nimport VuexSession from 'vuex-session';\n\nVue.use(VueRouter);\nVue.use(Vuex);\nVue.use(VuexSession);\n\nconst store = new Vuex.Store({\n  state: {\n    count: 0\n  },\n  mutations: {\n    increment (state) {\n      state.count++;\n    }\n  }\n});\n\nconst router = new VueRouter({\n  routes: [\n    { path: '/', component: App },\n    { path: '/about', component: About }\n  ]\n});\n\nnew Vue({\n  router,\n  store,\n  render: h => h(App)\n}).$mount('#app');\n</script>\n```"}
]
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
    padding: 12px 0;
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
      .select-input-type {
        z-index: 2;
        position: absolute;
        top: 0px;
        right: 0px;
      }
      .text-input {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        padding-right: 12px;
        margin: 1px;
        border: 1px solid transparent;
        border-radius: var(--border-radius-default, 4px);
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
