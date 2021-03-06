import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, FormGroup, Spinner } from "reactstrap"

import { IFundConcretization } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  onSubmit: any
  concretization?: IFundConcretization
}

const ConcretizationForm: React.FC<IProps> = ({ onSubmit, concretization = {
  description: "",
  maxLength: 280,
  question: ""
} }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IFundConcretization> initialValues={concretization} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => <Form onSubmit={handleSubmit}>
        <GeneralFormError
          errors={errors}
          prefix="fundConcretization"
          excludeFields={["description", "maxLength", "question"]}
        />

        <Field component={FormikInput}
          help="form.fundConcretization.question.help"
          label="fundConcretization.question"
          name="question"
          maxLength={1000}
          placeholder="form.fundConcretization.question.placeholder"
          required
          value={values.question}
        />

        <Field component={FormikRTE}
          help="form.fundConcretization.description.help"
          label="fundConcretization.description"
          name="description"
          placeholder="form.fundConcretization.description.placeholder"
          required
          value={values.description}
        />

        <Field component={FormikInput}
          help="form.fundConcretization.maxLength.help"
          label="fundConcretization.maxLength"
          name="maxLength"
          maxLength={4}
          placeholder="form.fundConcretization.maxLength.placeholder"
          required
          type="number"
          value={values.maxLength}
        />

        <FormGroup>
          <Button className="btn-action btn-icon" color="primary" type="submit" disabled={isSubmitting}>
            <Icon name="save" size={18} />
            {t("form.submit")} {isSubmitting && <Spinner />}
          </Button>
        </FormGroup>

        <p className="text-danger">{t("form.requiredFieldsHint")}</p>
      </Form>
    }
  </Formik>
}

export default ConcretizationForm
