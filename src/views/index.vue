<template>
  <n-layout has-sider class="h-full">
    <n-layout-sider
      collapse-mode="width"
      :collapsed-width="120"
      :width="240"
      show-trigger="arrow-circle"
      content-style="padding: 24px;"
      bordered
    >
      <!-- create new chat -->
      <n-button>Create New Chat</n-button>
      <!-- toggle theme -->
      <n-switch v-model:value="isDark" />
    </n-layout-sider>
    <n-layout>
      <n-layout-content class="h-full p-3">
        <div class="h-full flex flex-col">
          <!-- chat message list -->
          <div class="flex-1">
            <div
              v-for="item in messageList"
              :key="item.id"
              class="flex gap-2"
              :class="item.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
            >
              <div class="w-10 h-10 rounded-full bg-sky-300 text-center">
                <span class="text-10 leading-10 text-white text-center">{{ item.role === 'user' ? 'U' : 'A' }}</span>
              </div>
              <!-- little white bubble with border shadow -->
              <div class="bg-white flex items-center rounded-md px-1 border border-gray-300 shadow-md">
                <!-- use highlight.js -->
                <div class="text-md" v-html="getMarkdown(item.content)"></div>
              </div>
            </div>
          </div>
          <div class="p-x-40 flex">
            <n-input v-model:value="message" />
            <n-button>
              <template #icon>
                <Send />
              </template>
            </n-button>
          </div>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {useTheme} from '../AiAssistant/hook/theme.hook'
import {h, ref} from 'vue'
import {Send} from '@vicons/tabler'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import markdownit from 'markdown-it'
const {isDark} = useTheme()
const message = ref('')
const messageList = ref<any[]>([
  {
    id: 1,
    content: 'Hello, how are you today?',
    role: 'user'
  },
  {
    id: 2,
    // code example
    content: '```python\nprint("Hello, how are you today?")\n```',
    role: 'assistant'
  }
])

// use markdown-it to parse the content
function getMarkdown(content: string) {
  const md = markdownit({
    highlight: function (str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre><code class="hljs">' +
            hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
            '</code></pre>'
          )
        } catch (__) {}
      }

      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
    }
  })
  return md.render(content)
}
</script>
<style scoped></style>
