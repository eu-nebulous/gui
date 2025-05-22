<template>
  <div id="editor" ref="editorRef" :class="computedClass"></div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import {ref, onMounted, computed, useAttrs, onBeforeUnmount, watch} from "vue"
import { twMerge } from "tailwind-merge"
import { debounce } from "@/utils/helper.ts"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { editor } from "monaco-editor/esm/vs/editor/editor.api"
import IModelContentChangedEvent = editor.IModelContentChangedEvent
import ICodeEditor = editor.ICodeEditor

interface IEditorProps {
  modelValue: string
  language: "yaml" | "math" | "json" | "casbin"
  theme?: string
  fontSize?: number
  destroyDelay?: number
  autoLayout?: boolean
  withMinimap?: boolean
}

interface IEditorEmit {
  (e: "update:modelValue", value: string): void
  (e: "change", value: string, event: IModelContentChangedEvent): void
}

const props = withDefaults(defineProps<IEditorProps>(), {
  fontSize: 14,
  autoLayout: true,
  destroyDelay: 0,
  withMinimap: false
})
const emit = defineEmits<IEditorEmit>()

const attrs = useAttrs()

const computedClass = computed(() => twMerge(["w-full h-full", typeof attrs.class === "string" && attrs.class]))

onMounted(() => {
  initMonacoEditor()
})

const editorRef = ref()
let editorInstance: ICodeEditor

const initMonacoEditor = () => {
  monaco.editor.addKeybindingRule({
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space,
    command: "editor.action.triggerSuggest"
  })

  editorInstance = monaco.editor.create(editorRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: "vs-dark-custom-theme",
    fontSize: props.fontSize,
    automaticLayout: props.autoLayout,
    minimap: { enabled: props.withMinimap }
  })

  initEventHandlers()
}

const initEventHandlers = () => {
  if (editorInstance !== null) {
    editorInstance.onDidChangeModelContent((event: IModelContentChangedEvent) => {
      // @ts-ignore
      const value = editorInstance.getValue()
      if (props.modelValue !== value) {
        emit("change", value, event)
        emit("update:modelValue", value)
      }
    })
  }
}

// Add a function to update the editor content
const updateEditorContent = (newValue: string) => {
  if (editorInstance) {
    const currentValue = editorInstance.getValue();
    if (currentValue !== newValue) {
      // Get the current cursor position and scroll position
      const position = editorInstance.getPosition();
      const scrollTop = editorInstance.getScrollTop();

      // Update the content
      editorInstance.setValue(newValue);

      // Restore cursor and scroll positions
      if (position) {
        editorInstance.setPosition(position);
      }
      editorInstance.setScrollTop(scrollTop);
    }
  }
}

onBeforeUnmount(() => {
  setTimeout(destroy, props.destroyDelay)
})

const destroy = () => {
  window.removeEventListener("resize", debounced)
  editorInstance.dispose()
}

const resetEditorLayout = () => {
  editorInstance.layout({ width: 0, height: 0 })

  window.requestAnimationFrame(() => {
    const rect = editorRef.value.getBoundingClientRect()
    console.log(rect)
    editorInstance.layout({ width: rect.width, height: rect.height })
  })
}

const debounced = debounce(resetEditorLayout, 200)
window.addEventListener("resize", debounced)

// Watch for changes to modelValue and update editor content accordingly
watch(() => props.modelValue, (newValue) => {
  updateEditorContent(newValue);
}, { immediate: false })
</script>
