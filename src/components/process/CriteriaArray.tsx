import { Field, FieldArrayRenderProps, getIn } from "formik"
import React from "react"
import { Button, FormGroup, Label, FormText } from "reactstrap"

import FormikArrayInput from "components/common/form/FormikArrayInput"
import TranslatedHtml from "components/common/TranslatedHtml"
import Icon from "components/Icon"
import { useTranslation } from "services/i18n"

interface IProps extends FieldArrayRenderProps {
  label?: string
  name: string
}

const CriteriaArray = ({
  push, form, remove, name,
}: IProps) => {
  const { t } = useTranslation()
  const values = getIn(form, ["values", name])
  const error = getIn(form, ["errors", name])

  return (
    <FormGroup row={false}>
      <Label>{t("process.criteria")} *</Label>

      <FormText>
        <TranslatedHtml content={"form.process.criteria.help"} />
      </FormText>

      {(!values || values.length === 0) &&
        <div className="input-group">{t("default.empty")}</div>}

      {error && typeof error === "string" && <div className="text-danger d-block">
        <TranslatedHtml content={"_error:" + error} />
      </div>}

      {values && values.length > 0 && values.map((value, index) => (
        <div key={index}>
          <Field component={FormikArrayInput}
            name={`${name}.${index}`}
            placeholder="form.process.criteria.placeholder"
            onRemove={() => { remove(index); return false }}
            value={value}
          />
        </div>
      ))}

      <Button onClick={() => push("")} className="btn btn-sm d-block">
        <Icon name="plus" size={20} color="white" /> {t("form.process.addCriterion")}
      </Button>

    </FormGroup>
  )
}

export default CriteriaArray
