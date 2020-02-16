import { Field, FieldArray, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader, FormGroup, Spinner } from "reactstrap"

import { IFund } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import FormikDate from "components/common/form/FormikDate"
import FormikInput from "components/common/form/FormikInput"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes, routeWithParams } from "services/routes"
import CriteriaArray from "./CriteriaArray"

interface IProps {
  onSubmit: any
  fund?: IFund
}

// @todo client-side validation function

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
    }) => <Form onSubmit={handleSubmit}>
        <Card>
          <CardHeader id="form-fund-general">
            {t("form.fund.generalHeader")}

            <div className="icon-navigation">
              {isSubmitting
                ? <a className="navigation-item" aria-label={t("form.save")}><Spinner /></a>
                : <a onClick={() => handleSubmit()} className="navigation-item" aria-label={t("form.save")} title={t("form.save")}><Icon name="save" size={24} /></a>}
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                {fund.id
                  ? <Link
                    href={Routes.FUND_DETAILS}
                    as={routeWithParams(Routes.FUND_DETAILS, { id: fund.id })}
                  >
                    <a>{t("goto.fundDetails")}</a>
                  </Link>
                  : <Link href={Routes.FUND_OVERVIEW}>
                    <a>{t("goto.fundManagement")}</a>
                  </Link>
                }
              </DropdownComponent>
            </div>
          </CardHeader>

          <CardBody>
            <GeneralFormError
              errors={errors}
              prefix="fund"
              excludeFields={["briefingDate", "budget", "criteria", "description", "finalJuryDate",
                "imprint", "jurorsPerApplication", "maximumGrant", "minimumGrant", "name", "ratingBegin",
                "ratingEnd", "region", "sponsor", "submissionBegin", "submissionEnd"]}
            />

            <Field component={FormikInput}
              help="form.fund.name.help"
              label="fund.name"
              name="name"
              // @todo maxLength
              placeholder="form.fund.name.placeholder"
              required
              value={values.name}
            />

            <Field component={FormikRTE}
              help="form.fund.description.help"
              label="fund.description"
              name="description"
              maxLength={10000}
              placeholder="form.fund.description.placeholder"
              required
              value={values.description}
            />

            <Field component={FormikInput}
              help="form.fund.region.help"
              label="fund.region"
              name="region"
              // @todo maxLength
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
              // @todo maxLength
              placeholder="form.fund.sponsor.placeholder"
              required
              value={values.sponsor}
            />

            <Field component={FormikRTE}
              help="form.fund.imprint.help"
              label="fund.imprint"
              name="imprint"
              // @todo maxLength
              placeholder="form.fund.imprint.placeholder"
              required
              value={values.imprint}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader id="form-fund-funding">
            {t("form.fund.fundingHeader")}

            <div className="icon-navigation">
              {isSubmitting
                ? <a className="navigation-item" aria-label={t("form.save")}><Spinner /></a>
                : <a onClick={() => handleSubmit()} className="navigation-item" aria-label={t("form.save")} title={t("form.save")}><Icon name="save" size={24} /></a>}
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                {fund.id
                  ? <Link
                    href={Routes.FUND_DETAILS}
                    as={routeWithParams(Routes.FUND_DETAILS, { id: fund.id })}
                  >
                    <a>{t("goto.fundDetails")}</a>
                  </Link>
                  : <Link href={Routes.FUND_OVERVIEW}>
                    <a>{t("goto.fundManagement")}</a>
                  </Link>
                }
              </DropdownComponent>
            </div>
          </CardHeader>
          <CardBody>
            <Field component={FormikInput}
              help="form.fund.budget.help"
              label="fund.budget"
              name="budget"
              placeholder="form.fund.budget.placeholder"
              min="0"
              max="99999999"
              step="0.01"
              type="number"
              value={values.budget}
            />

            <Field component={FormikInput}
              help="form.fund.minimumGrant.help"
              label="fund.minimumGrant"
              name="minimumGrant"
              placeholder="form.fund.minimumGrant.placeholder"
              min="0"
              max="99999999"
              step="0.01"
              type="number"
              value={values.minimumGrant}
            />

            <Field component={FormikInput}
              help="form.fund.maximumGrant.help"
              label="fund.maximumGrant"
              name="maximumGrant"
              placeholder="form.fund.maximumGrant.placeholder"
              min="0"
              max="99999999"
              step="0.01"
              type="number"
              value={values.maximumGrant}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader id="form-fund-application">
            {t("form.fund.applicationHeader")}

            <div className="icon-navigation">
              {isSubmitting
                ? <a className="navigation-item" aria-label={t("form.save")}><Spinner /></a>
                : <a onClick={() => handleSubmit()} className="navigation-item" aria-label={t("form.save")} title={t("form.save")}><Icon name="save" size={24} /></a>}
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                {fund.id
                  ? <Link
                    href={Routes.FUND_DETAILS}
                    as={routeWithParams(Routes.FUND_DETAILS, { id: fund.id })}
                  >
                    <a>{t("goto.fundDetails")}</a>
                  </Link>
                  : <Link href={Routes.FUND_OVERVIEW}>
                    <a>{t("goto.fundManagement")}</a>
                  </Link>
                }
              </DropdownComponent>
            </div>
          </CardHeader>
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
          <CardHeader id="form-fund-jury">
            {t("form.fund.juryHeader")}

            <div className="icon-navigation">
              {isSubmitting
                ? <a className="navigation-item" aria-label={t("form.save")}><Spinner /></a>
                : <a onClick={() => handleSubmit()} className="navigation-item" aria-label={t("form.save")} title={t("form.save")}><Icon name="save" size={24} /></a>}
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                {fund.id
                  ? <Link
                    href={Routes.FUND_DETAILS}
                    as={routeWithParams(Routes.FUND_DETAILS, { id: fund.id })}
                  >
                    <a>{t("goto.fundDetails")}</a>
                  </Link>
                  : <Link href={Routes.FUND_OVERVIEW}>
                    <a>{t("goto.fundManagement")}</a>
                  </Link>
                }
              </DropdownComponent>
            </div>
          </CardHeader>
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
              <Button className="btn-action btn-icon" color="primary" type="submit" disabled={isSubmitting}>
                <Icon name="save" size={18} />
                {t("form.submit")} {isSubmitting && <Spinner />}
              </Button>
            </FormGroup>

            <p className="text-danger">{t("form.requiredFieldsHint")}</p>
          </CardBody>
        </Card>
      </Form>
    }
  </Formik>
}

export default FundForm
