import React, { useEffect } from "react"
import { connect, ConnectedProps } from "react-redux"
import { toast, ToastContainer as WrappedTC } from "react-toastify"
import { AnyAction, Dispatch } from "redux"

import { removeNotificationAction } from "redux/actions/notifications"
import { AppState } from "redux/reducer"
import { INotification } from "redux/reducer/notifications"
import { useTranslation } from "services/i18n"

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  removeNotification: (id: string) => dispatch(removeNotificationAction(id)),
})

const mapStateToProps = (state: AppState) => ({ notifications: state.notifications })

const connector = connect(mapStateToProps, mapDispatchToProps)
type Props = ConnectedProps<typeof connector>

/**
 * Wrap the react-toastify container to get our notifications from the redux store
 * and translate them before displaying, as redux(-saga) has no access to the translation.
 *
 * @param Props
 */
const ToastContainer = ({ notifications, removeNotification }: Props) => {
  const { t } = useTranslation()

  useEffect(() => {
    // toasts are not renderes SSR -> execute on client only to keep notifications in state
    if (process.browser) {
      notifications.forEach((notification: INotification) => {
        toast(t(notification.content), notification.options)
        removeNotification(notification.id)
      })
    }
  }, [])

  return (
    <WrappedTC autoClose={8000} />
  )
}

export default connector(ToastContainer)
