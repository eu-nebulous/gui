import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./Master.vue"
import router from "./router"
import axiosSetup from "@/utils/axios"
import "./assets/css/app.css"
import "@/utils/monaco.ts"

axiosSetup()

createApp(App).use(router).use(createPinia()).mount("#app")
