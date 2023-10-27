import { Ref, UnwrapRef } from "vue"

export interface CkeditorElement extends HTMLDivElement {
  CKEditor: unknown
}

export type CkeditorProps = {
  modelValue: string
  config: { initialData: string }
  disabled?: boolean
  refKey?: string
}

export type CkeditorEmit = {
  (e: "update:modelValue", value: string): void
  (e: "focus", value: string, editor: unknown): void
  (e: "blur", value: string, editor: unknown): void
  (e: "ready", editor: unknown): void
}

const init = async (
  el: CkeditorElement,
  editorBuild: unknown,
  {
    props,
    emit,
    cacheData
  }: {
    props: CkeditorProps
    emit: CkeditorEmit
    cacheData: Ref<UnwrapRef<string>>
  }
) => {
  // Initial data
  cacheData.value = props.modelValue
  props.config.initialData = props.modelValue

  // Init CKEditor
  // @ts-ignore
  const editor = await editorBuild.create(el, props.config)

  // Attach CKEditor instance
  el.CKEditor = editor

  // Set initial disabled state
  props.disabled && editor.enableReadOnlyMode("ckeditor")

  // Set on change event
  editor.model.document.on("change:data", () => {
    const data = editor.getData()
    cacheData.value = data
    emit("update:modelValue", data)
  })

  // Set on focus event
  editor.editing.view.document.on("focus", (evt: string) => {
    emit("focus", evt, editor)
  })

  // Set on blur event
  editor.editing.view.document.on("blur", (evt: string) => {
    emit("blur", evt, editor)
  })

  // Set on ready event
  emit("ready", editor)
}

// Watch model change
const updateData = (
  el: CkeditorElement,
  {
    props,
    cacheData
  }: {
    props: CkeditorProps
    cacheData: Ref<UnwrapRef<string>>
  }
) => {
  if (cacheData.value !== props.modelValue) {
    // @ts-ignore
    el.CKEditor.setData(props.modelValue)
  }
}

export { init, updateData }
