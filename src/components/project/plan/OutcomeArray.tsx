import { Field, FieldArrayRenderProps, getIn } from "formik"
import React, { ReactElement } from "react"
import { Button, FormGroup, FormText, Label } from "reactstrap"

import FormikArrayInput from "components/common/form/FormikArrayInput"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import { useTranslation } from "services/i18n"

interface IProps extends FieldArrayRenderProps {
  label?: string
  name: string
}

const OutcomeArray = ({
  push, form, remove, name,
}: IProps): ReactElement => {
  const { t } = useTranslation()
  const values = getIn(form, ["values", name])
  const error = getIn(form, ["errors", name])

  // @todo FormikArrayTextarea
  return (
    <FormGroup row={false}>
      <Label>{t("project.outcome")}</Label>

      <FormText>
        <TranslatedHtml content={"form.project.outcome.help"} />
      </FormText>

      {(!values || values.length === 0) &&
        <div className="input-group">{t("default.empty")}</div>}

      {error && typeof error === "string" && <div className="text-danger d-block">
        <TranslatedHtml content={"_error:" + error} />
      </div>}

      {values && values.length > 0 && values.map((value, index: number) => (
        <div key={index}>
          <Field component={FormikArrayInput}
            name={`${name}.${index}`}
            placeholder="form.project.outcome.placeholder"
            onRemove={() => { remove(index); return false }}
            value={value}
          />
        </div>
      ))}

      <Button onClick={() => push("")} className="btn btn-sm d-block">
        <Icon name="plus" size={20} /> {t("form.project.plan.addOutcome")}
      </Button>

    </FormGroup>
  )
}

export default OutcomeArray
