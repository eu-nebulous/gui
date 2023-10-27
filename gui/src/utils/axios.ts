import axios, { AxiosError } from "axios"
import router from "@/router"
import { SNACKBAR_MESSAGE_TYPES } from "../constants"
import { useUIStore } from "@/store/modules/ui.ts"

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers["Content-Type"] = "application/json"
axios.defaults.headers["Access-Control-Allow-Origin"] = "*"

export default function setup() {
  axios.interceptors.request.use(
    (req) => {
      const token = localStorage.getItem("access-token")
      if (token) {
        req.headers.Authorization = `Bearer ${token}`
      }

      return req
    },
    (err) => Promise.reject(err)
  )

  axios.interceptors.response.use(
    (res) => {
      return res
    },
    (err) => {
      errorHandler(err)
      return Promise.reject(err)
    }
  )
}

const errorHandler = (error: AxiosError<object>) => {
  const uiStore = useUIStore()

  if (!error.response) {
    console.log("API | Network/Server error")
    uiStore.setSnackbarMessage({
      message: "API | Network/Server error",
      type: SNACKBAR_MESSAGE_TYPES.ERROR
    })
    return Promise.reject(error)
  }

  switch (error.response.status) {
    case 400:
      uiStore.setSnackbarMessage({
        message: `API | Nothing to display. Data Not Found. ${error.message}`,
        type: SNACKBAR_MESSAGE_TYPES.ERROR
      })
      console.error(error.response.status, error.message)
      break

    case 401: // authentication error, logout the user
      uiStore.setSnackbarMessage({
        message: `${error.response.status}. API | Please login again. Session Expired`,
        type: SNACKBAR_MESSAGE_TYPES.ERROR
      })
      console.error(error.response.status, error.message)
      localStorage.removeItem("access-token")
      router.push({
        name: "login"
      })
      break

    case 403:
      uiStore.setSnackbarMessage({
        message: `${error.response.status}. API | Access denied. ${error.message}`,
        type: SNACKBAR_MESSAGE_TYPES.ERROR
      })
      console.error(error.response.status, error.message)
      break

    case 404:
      uiStore.setSnackbarMessage({
        message: `${error.response.status}. API | Dataset not found. ${error.message}`,
        type: SNACKBAR_MESSAGE_TYPES.ERROR
      })
      console.error(error.response.status, error.message)
      break

    case 422:
      console.error(error.response.status, error.message, error.response.data)
      console.log("API | Validation error", "Unprocessable Content")
      break

    default:
      uiStore.setSnackbarMessage({
        message: `${error.response.status}. ${error.message}`,
        type: SNACKBAR_MESSAGE_TYPES.ERROR
      })
      console.error(error.response.status, error.message)
  }
  return Promise.reject(error)
}
