import { defineStore } from "pinia"
import { MODAL_WINDOW_NAMES } from "@/constants"
import { ISnackbarMessage } from "@/components/Snackbar/index.vue"

type ModalWindowType = { name: keyof typeof MODAL_WINDOW_NAMES; title?: string; payload?: object }

interface UIState {
  openedModalWindow: ModalWindowType | null
  snackbarMessage: ISnackbarMessage | null
}

export const useUIStore = defineStore("ui", {
  state: (): UIState => ({
    openedModalWindow: null,
    snackbarMessage: null
  }),
  getters: {
    isModalOpened: (state) => Boolean(state.openedModalWindow?.name)
  },
  actions: {
    setSnackbarMessage(messageObject: ISnackbarMessage | null = null) {
      this.snackbarMessage = messageObject
    },
    setModalWindowState(openedModalWindow: ModalWindowType | null = null, skipConfirmation = false) {
      // Prevented closing certain windows through confirmation modal
      // @ts-ignore
      if (
        !skipConfirmation &&
        !openedModalWindow &&
        [
          MODAL_WINDOW_NAMES.USER_CREATION,
          MODAL_WINDOW_NAMES.USER_EDITING,
          MODAL_WINDOW_NAMES.RESOURCE_CREATION,
          MODAL_WINDOW_NAMES.RESOURCE_EDITING
        ].includes(this.openedModalWindow?.name)
      ) {
        const cachedModalSettings = this.openedModalWindow
        this.setModalWindowState({
          name: MODAL_WINDOW_NAMES.EXIT_MESSAGE_MODAL,
          payload: {
            message: "Are you sure you want to exit? Unsaved edited data in dialog will be lost.",
            controlledWindowClosure: true,
            isConfirmPresent: true,
            confirmAction: () => {
              console.log("Confirm action")
              this.openedModalWindow = null
              this.setSnackbarMessage()
            },
            cancelAction: () => {
              this.openedModalWindow = cachedModalSettings
            }
          }
        })
      } else {
        this.openedModalWindow = openedModalWindow
        this.setSnackbarMessage()
      }
    }
  }
})
