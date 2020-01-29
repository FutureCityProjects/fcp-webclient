import { Field, FieldArray, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader, FormGroup, Spinner } from "reactstrap"

import { IFund } from "api/schema"
import FormikDate from "components/common/form/FormikDate"
import FormikInput from "components/common/form/FormikInput"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import { useTranslation } from "services/i18n"
import CriteriaArray from "./CriteriaArray"

interface IProps {
  onSubmit: any
  fund?: IFund
}

const FundForm = ({ onSubmit, fund = {
  briefingDate: null,
  budget: 0,
  criteria: null,
  description: "",
  finalJuryDate: null,
  imprint: "",
  jurorsPerApplication: 2,
  maximumGrant: 0,
  minimumGrant: 0,
  name: "",
  ratingBegin: null,
  ratingEnd: null,
  region: "",
  sponsor: "",
  submissionBegin: null,
  submissionEnd: null,
} }: IProps) => {
  const { t } = useTranslation()

  return <Formik<IFund> initialValues={fund} onSubmit={onSubmit}>
    {({
      errors,
      handleSubmit,
      isSubmitting,
      values,
    }) => {
      return (
        <Form onSubmit={handleSubmit}>
          <Card>
            <CardHeader id="form-fund-general">{t("form.fund.generalHeader")}</CardHeader>
            <CardBody>
              <GeneralFormError errors={errors} values={values} />

              <Field component={FormikInput}
                help="form.fund.name.help"
                label="fund.name"
                name="name"
                placeholder="form.fund.name.placeholder"
                required
                value={values.name}
              />

              <Field component={FormikRTE}
                help="form.fund.description.help"
                label="fund.description"
                name="description"
                placeholder="form.fund.description.placeholder"
                required
                value={values.description}
              />

              <Field component={FormikInput}
                help="form.fund.region.help"
                label="fund.region"
                name="region"
                placeholder="form.fund.region.placeholder"
                required
                value={values.region}
              />

              <FieldArray
                name="criteria"
                component={CriteriaArray}
              />

              <Field component={FormikInput}
                help="form.fund.sponsor.help"
                label="fund.sponsor"
                name="sponsor"
                placeholder="form.fund.sponsor.placeholder"
                required
                value={values.sponsor}
              />

              <Field component={FormikRTE}
                help="form.fund.imprint.help"
                label="fund.imprint"
                name="imprint"
                placeholder="form.fund.imprint.placeholder"
                required
                value={values.imprint}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader id="form-fund-funding">{t("form.fund.fundingHeader")}</CardHeader>
            <CardBody>
              <Field component={FormikInput}
                help="form.fund.budget.help"
                label="fund.budget"
                name="budget"
                placeholder="form.fund.budget.placeholder"
                type="number"
                value={values.budget}
              />

              <Field component={FormikInput}
                help="form.fund.maximumGrant.help"
                label="fund.maximumGrant"
                name="maximumGrant"
                placeholder="form.fund.maximumGrant.placeholder"
                type="number"
                value={values.maximumGrant}
              />

              <Field component={FormikInput}
                help="form.fund.minimumGrant.help"
                label="fund.minimumGrant"
                name="minimumGrant"
                placeholder="form.fund.minimumGrant.placeholder"
                type="number"
                value={values.minimumGrant}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader id="form-fund-application">{t("form.fund.applicationHeader")}</CardHeader>
            <CardBody>
              <Field component={FormikDate}
                help="form.fund.submissionBegin.help"
                label="fund.submissionBegin"
                name="submissionBegin"
                value={values.submissionBegin}
              />

              <Field component={FormikDate}
                help="form.fund.submissionEnd.help"
                label="fund.submissionEnd"
                name="submissionEnd"
                value={values.submissionEnd}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader id="form-fund-jury">{t("form.fund.juryHeader")}</CardHeader>
            <CardBody>
              <Field component={FormikInput}
                help="form.fund.jurorsPerApplication.help"
                label="fund.jurorsPerApplication"
                name="jurorsPerApplication"
                placeholder="form.fund.jurorsPerApplication.placeholder"
                type="number"
                value={values.jurorsPerApplication}
              />

              <Field component={FormikDate}
                help="form.fund.ratingBegin.help"
                label="fund.ratingBegin"
                name="ratingBegin"
                value={values.ratingBegin}
              />

              <Field component={FormikDate}
                help="form.fund.ratingEnd.help"
                label="fund.ratingEnd"
                name="ratingEnd"
                value={values.ratingEnd}
              />

              <Field component={FormikDate}
                help="form.fund.briefingDate.help"
                label="fund.briefingDate"
                name="briefingDate"
                value={values.briefingDate}
              />

              <Field component={FormikDate}
                help="form.fund.finalJuryDate.help"
                label="fund.finalJuryDate"
                name="finalJuryDate"
                value={values.finalJuryDate}
              />

              <FormGroup>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {t("form.submit")} {isSubmitting && <Spinner />}
                </Button>
              </FormGroup>

              <p className="text-danger">{t("form.requiredFieldsHint")}</p>
            </CardBody>
          </Card>
        </Form>
      )
    }}
  </Formik>
}

export default FundForm
