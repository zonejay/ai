<template>
  <div class="image-urls-check">
    <div class="content">
      <n-form :model="formData" :rules="rules" ref="ruleForm" layout="vertical" errorMessageType="underItem">
        <n-form-item field="urls">
          <n-input auto-size v-model="formData.urls" type="textarea"></n-input>
        </n-form-item>
      </n-form>
    </div>
    <div class="footer">
      <n-button theme="secondary" size="small" @click="handleCancel">取消</n-button>
      <n-button theme="primary" size="small" @click="handleConfirm" :loading="isLoading">确定</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {FormRules} from 'naive-ui'
import {reactive, ref} from 'vue'
import {checkImagesType, checkUrls} from '../hook/aiAssistant.hook'

const emits = defineEmits(['cancel', 'confirm'])
const formData = reactive({
  urls: ''
})
const isLoading = ref(false)
const ruleForm = ref()
const rules: FormRules = reactive({
  urls: [
    {
      validator: async (v, c) => {
        if (!v) {
          return c('请输入图片链接')
        }
        // 检查链接有效性
        try {
          const ret = checkUrls(v)
          isLoading.value = true
          await checkImagesType(ret)
          c()
        } catch (error: any) {
          console.log(error)
          c(error?.message)
        } finally {
          isLoading.value = false
        }
      }
    }
  ]
})
function handleConfirm() {
  // TODO
  ruleForm.value.validate(async (error: Object | undefined) => {
    if (!error) {
      emits('confirm', formData.urls)
    }
  })
}
function handleCancel() {
  console.log('cancel')

  ruleForm.value.resetFields()
  emits('cancel')
}
</script>

<style scoped lang="scss">
.image-urls-check {
  width: 432px;
}
.footer {
  display: flex;
  gap: var(--spacing-l, 12px);
  justify-content: flex-end;
}
</style>
