import { defineStore } from "pinia"

interface DarkModeState {
  darkModeValue: boolean
}

export const useDarkModeStore = defineStore("darkMode", {
  state: (): DarkModeState => ({
    darkModeValue: true // localStorage.getItem("darkMode") === "true"
  }),
  getters: {
    darkMode(state) {
      console.log("State", state);
      if (localStorage.getItem("darkMode") === null) {
        localStorage.setItem("darkMode", "true")
      }

      return true
    }
  },
  actions: {
    setDarkMode(darkMode: boolean) {
      console.log("State", darkMode);
      localStorage.setItem("darkMode", darkMode.toString())
    }
  }
})
