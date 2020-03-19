import { NextComponentType, NextPageContext } from "next"
import { WithTranslation } from "next-i18next"

export {
  appWithTranslation,
  default as nextI18next,
  useTranslation,
  withTranslation,
} from "../../config/i18n"

export const includeDefaultNamespaces = (namespaces: string[] = []) =>
  ["common", "_error"].concat(namespaces)

export type I18nPage<P = {} & WithTranslation> = NextComponentType<
  NextPageContext,
  { namespacesRequired: string[] },
  P & { namespacesRequired: string[] }
>
