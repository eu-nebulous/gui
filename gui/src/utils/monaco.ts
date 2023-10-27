import "monaco-editor/esm/vs/editor/editor.all.js"
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js"
import "monaco-editor/esm/vs/language/json/monaco.contribution"
import "monaco-editor/esm/vs/basic-languages/monaco.contribution"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
//@ts-ignore
import YamlWorker from "@/base-components/MonacoEditor/yaml.worker.js?worker"
import mathLang, { keywords } from "@/base-components/MonacoEditor/math-syntax.ts"
import colors from "tailwindcss/colors"
import { languages } from "monaco-editor/esm/vs/editor/editor.api"
import IMonarchLanguage = languages.IMonarchLanguage
import ProviderResult = languages.ProviderResult
import CompletionList = languages.CompletionList

/* WEB WORKER */
// TODO: investigate how to get Web Workers working
window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case "editorWorkerService":
        return new EditorWorker()
      case "yaml":
        return new YamlWorker()
      default:
        throw new Error(`Unknown label ${label}`)
    }
  }
}

monaco.languages.register({ id: "math" })
monaco.languages.setMonarchTokensProvider("math", mathLang as IMonarchLanguage)

monaco.languages.registerCompletionItemProvider("math", {
  provideCompletionItems(model, position): ProviderResult<CompletionList> {
    const word = model.getWordUntilPosition(position)
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    }
    const suggestions = keywords.map((k) => ({
      label: k,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: k,
      range
    }))

    return {
      suggestions
    }
  }
})

// ISSUE: https://github.com/Microsoft/monaco-editor/issues/338
/* THEMES */
monaco.editor.defineTheme("vs-dark-custom-theme", {
  base: "vs",
  inherit: true,
  rules: [
    { token: "keyword.math", foreground: colors.orange["500"], fontStyle: "bold" },
    { token: "comment.math", foreground: colors.green["600"], fontStyle: "bold" },
    { token: "string.math", foreground: colors.green["300"], fontStyle: "bold" },
    { token: "variable.math", foreground: colors.orange["400"], fontStyle: "bold" },
    { token: "operator.math", foreground: colors.orange["600"], fontStyle: "bold" },
    { token: "delimiter.math", foreground: colors.orange["600"], fontStyle: "bold" },
    { token: "brackets.math", foreground: colors.green["600"], fontStyle: "bold" },
    { token: "keyword.yaml", foreground: colors.orange["500"] },
    { token: "comments.yaml", foreground: colors.green["600"] },
    { token: "string.yaml", foreground: colors.orange["300"] },
    { token: "type.yaml", foreground: colors.green["600"] },
    { token: "operators.yaml", foreground: colors.orange["300"] }
    // TODO: get this token working: { token: "delimiter.bracket.yaml", foreground: colors.orange["300"] }
  ],
  colors: {
    "editor.background": colors.stone["900"],
    "minimap.background": colors.stone["900"],
    "editorLineNumber.foreground": colors.orange["600"],
    "editorLineNumber.activeForeground": colors.green["600"],
    "editor.selectionBackground": colors.teal["900"],
    "editorCursor.foreground": colors.teal["300"],
    "editor.lineHighlightBorder": colors.stone["900"]
  }
})
