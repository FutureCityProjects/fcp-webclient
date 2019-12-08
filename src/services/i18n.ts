import { NextComponentType } from "next"
import { WithTranslation } from "next-i18next"
import { NextJSContext } from "next-redux-wrapper"

export { default as nextI18next, withTranslation, appWithTranslation } from "../../config/i18n"

export const includeDefaultNamespaces = (namespaces: string[] = []) =>
  ["common", "_error"].concat(namespaces)

export type I18nPage<P = {} & WithTranslation> = NextComponentType<
  NextJSContext,
  { namespacesRequired: string[] },
  P & { namespacesRequired: string[] }
>
