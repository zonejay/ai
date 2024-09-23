import {nextTick, ref} from 'vue'
import type {ScrollbarInst} from 'naive-ui'

export function useScroll() {
  const scrollRef = ref<ScrollbarInst | null>(null)
  const listRef = ref<HTMLElement | null>(null)

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value && listRef.value) {
      scrollRef.value?.scrollTo({top: listRef.value.scrollHeight})
    }
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value && listRef.value) {
      scrollRef.value?.scrollTo({top: 0})
    }
  }

  return {
    listRef,
    scrollRef,
    scrollToBottom,
    scrollToTop
  }
}
