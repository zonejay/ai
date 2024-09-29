export enum LlmModels {
  DLZ = 'default',
  GLM = 'glm-4-flash',
  GEMINI_NANO = 'gemini-nano',
  GEMINI_PLUS = 'gemini-plus',
}
export const AdapterType = {
  [LlmModels.DLZ]: () => { },
  [LlmModels.GLM]: () => { },
  [LlmModels.GEMINI_NANO]: () => { }
}
