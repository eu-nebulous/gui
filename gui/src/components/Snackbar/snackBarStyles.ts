import { SNACKBAR_MESSAGE_TYPES } from "@/constants"

const snackbarError = {
  variant: "danger",
  icon: "AlertTriangle"
} as const

const snackbarWarning = {
  variant: "warning",
  icon: "AlertTriangle"
} as const

const snackbarNotification = {
  variant: "primary",
  icon: "Info"
} as const

const snackbarSuccess = {
  variant: "success",
  icon: "Check"
} as const

type SnackbarStylesType =
  | typeof snackbarSuccess
  | typeof snackbarNotification
  | typeof snackbarWarning
  | typeof snackbarError

const getSnackbarStyle = (type: keyof typeof SNACKBAR_MESSAGE_TYPES): SnackbarStylesType => {
  switch (type) {
    case SNACKBAR_MESSAGE_TYPES.ERROR:
      return snackbarError
    case SNACKBAR_MESSAGE_TYPES.WARNING:
      return snackbarWarning
    case SNACKBAR_MESSAGE_TYPES.SUCCESS:
      return snackbarSuccess
    case SNACKBAR_MESSAGE_TYPES.NOTIFICATION:
    default:
      return snackbarNotification
  }
}

export default getSnackbarStyle
