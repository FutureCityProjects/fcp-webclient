import uniqueId from "lodash/uniqueId"
import { ToastOptions } from "react-toastify"

import { NotificationActions, NotificationActionTypes } from "../actions/notifications"

export interface INotification {
  content: string
  id: string
  options: ToastOptions
}

export type NotificationState = INotification[]

export const intitialNotificationState: NotificationState = []

const notificationReducer =
  (state: NotificationState = intitialNotificationState, action: NotificationActions): NotificationState => {
    switch (action.type) {
      case NotificationActionTypes.AddNotification:
        const id: string = uniqueId()
        return [...state, { content: action.content, id, options: action.options }]

      case NotificationActionTypes.RemoveNotification:
        return state.filter((element) => element.id !== action.id)

      default:
        return state
    }
  }

export default notificationReducer
