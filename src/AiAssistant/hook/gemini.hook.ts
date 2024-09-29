import {onMounted, ref} from 'vue'

const useGemini = () => {
  const isAvailable = ref(false)
  async function checkIsAvailable() {
    const res = await (window as any).ai.assistant.capabilities()
    isAvailable.value = res.available === 'readily'
  }

  async function startSession(prompt: string, history: any[]) {
    const initialPrompts = history.map((item) => {
      return {
        role: item.role,
        content: item.content
      }
    })
    const session = await (window as any).ai.assistant.create({
      initialPrompts: initialPrompts
    })
    console.log(session)
    const result = await session.prompt(prompt)
    session.destroy()
    return result
  }

  onMounted(async () => {
    await checkIsAvailable()
  })

  return {
    isAvailable,
    startSession
  }
}

export {useGemini}
