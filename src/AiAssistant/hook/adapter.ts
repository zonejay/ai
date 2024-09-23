export enum LlmModels {
  DLZ = 'default',
  GLM = 'glm-4-flash',
}
export const AdapterType = {
  [LlmModels.DLZ]: () => {},
  [LlmModels.GLM]: () => {},
};
