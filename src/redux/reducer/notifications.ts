import { ToastOptions } from "react-toastify"
import uuidv4 from "uuid/v4"

import { NotificationActions, NotificationActionTypes } from "../actions/notifications"

export interface INotification {
  content: string,
  id: string,
  options: ToastOptions
}

export type NotificationState = INotification[]

export const intitialNotificationState: NotificationState = []

const notificationReducer =
  (state: NotificationState = intitialNotificationState, action: NotificationActions): NotificationState => {
    switch (action.type) {
      case NotificationActionTypes.ADD_NOTIFICATION:
        const id = uuidv4()
        return [...state, { content: action.content, id, options: action.options }]

      case NotificationActionTypes.REMOVE_NOTIFICATION:
        return state.filter((element) => element.id !== action.id)

      default:
        return state
    }
  }

export default notificationReducer
