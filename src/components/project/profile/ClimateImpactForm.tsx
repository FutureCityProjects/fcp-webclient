import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"

import { IProject } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import FormikCheckbox from "components/common/form/FormikCheckbox"
import FormikRTE from "components/common/form/FormikRTE"
import GeneralFormError from "components/common/form/GeneralFormError"
import Icon from "components/common/Icon"
import Link from "next/link"
import { useTranslation } from "services/i18n"
import { Routes } from "services/routes"

// @todo complete validation
const validate = (values: IProject) => {
  if (values) {
    const errors: { [key: string]: string } = {}

    return errors
  }
}

interface IProps {
  onSubmit: any
  project: IProject
}

const ClimateImpactForm: React.FC<IProps> = (props: IProps) => {
  const { onSubmit, project } = props
  const { t } = useTranslation()

  return <Card className="body-card">
    <Formik
      initialValues={project}
      onSubmit={onSubmit}
      validate={validate}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({
        errors,
        handleSubmit,
        isSubmitting,
        values,
      }) => {
        const useEmissionAvoidance = values.climateImpact.resourceUsageReduction
          || values.climateImpact.usingRenewableResources
          || values.climateImpact.reducingFossilMobility
          || values.climateImpact.adaptingFoodSources
          || values.climateImpact.adaptingPostFossilFinances

        const useChangeAdaption = values.climateImpact.adaptingResilientBusinessModels
          || values.climateImpact.preparingForExtremeWeather
          || values.climateImpact.supportingClimateRelevantPolitics

        const useCollaborationImplementation = values.climateImpact.educatingClimateEmpowerment
          || values.climateImpact.educatingClimateEmpowerment
          || values.climateImpact.supportingCollaboration
          || values.climateImpact.otherClimateImpacts

        return <Form className="climate-impact-form" onSubmit={handleSubmit}>
          <CardHeader>
            {t("form.project.climateImpact.header")}

            <div className="icon-navigation">
              <DropdownComponent className="navigation-item" button={<Icon name="grid" size={24} />}>
                <Link href={Routes.MY_PROJECTS} as={Routes.MY_PROJECTS + "#project-" + project.id}>
                  <a>{t("goto.myProjects")}</a>
                </Link>
              </DropdownComponent>
            </div>
          </CardHeader>
          <CardBody>
            <GeneralFormError
              errors={errors}
              prefix="fundApplication"
              excludeFields={[
                "climateImpact.resourceUsageReduction",
                "climateImpact.usingRenewableResources",
                "climateImpact.reducingFossilMobility",
                "climateImpact.adaptingFoodSources",
                "climateImpact.adaptingPostFossilFinances",
                "climateImpact.emissionAvoidance",
                "climateImpact.preparingForExtremeWeather",
                "climateImpact.adaptingResilientBusinessModels",
                "climateImpact.supportingClimateRelevantPolitics",
                "climateImpact.changeAdaption",
                "climateImpact.educatingClimateKnowledge",
                "climateImpact.educatingClimateEmpowerment",
                "climateImpact.supportingCollaboration",
                "climateImpact.otherClimateImpacts",
                "climateImpact.collaborationImplementation"
              ]}
            />

            <h4>{t("form.project.climateImpact.emissionAvoidance.header")}</h4>
            <Row>
              <Col>
                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.resourceUsageReduction.help"
                  label="form.project.climateImpact.resourceUsageReduction.label"
                  name="climateImpact.resourceUsageReduction"
                  checked={values.climateImpact?.resourceUsageReduction ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.usingRenewableResources.help"
                  label="form.project.climateImpact.usingRenewableResources.label"
                  name="climateImpact.usingRenewableResources"
                  checked={values.climateImpact?.usingRenewableResources ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.reducingFossilMobility.help"
                  label="form.project.climateImpact.reducingFossilMobility.label"
                  name="climateImpact.reducingFossilMobility"
                  checked={values.climateImpact?.reducingFossilMobility ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.adaptingFoodSources.help"
                  label="form.project.climateImpact.adaptingFoodSources.label"
                  name="climateImpact.adaptingFoodSources"
                  checked={values.climateImpact?.adaptingFoodSources ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.adaptingPostFossilFinances.help"
                  label="form.project.climateImpact.adaptingPostFossilFinances.label"
                  name="climateImpact.adaptingPostFossilFinances"
                  checked={values.climateImpact?.adaptingPostFossilFinances ?? false}
                />

                <Field component={FormikRTE}
                  className={useEmissionAvoidance ? "d-block" : "d-none"}
                  help="form.project.climateImpact.emissionAvoidance.help"
                  label="form.project.climateImpact.emissionAvoidance.label"
                  name="climateImpact.emissionAvoidance"
                  placeholder="form.project.climateImpact.emissionAvoidance.placeholder"
                  value={values.climateImpact?.emissionAvoidance ?? ""}
                />
              </Col>
            </Row>

            <h4>{t("form.project.climateImpact.changeAdaption.header")}</h4>
            <Row>
              <Col>
                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.preparingForExtremeWeather.help"
                  label="form.project.climateImpact.preparingForExtremeWeather.label"
                  name="climateImpact.preparingForExtremeWeather"
                  checked={values.climateImpact?.preparingForExtremeWeather ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.adaptingResilientBusinessModels.help"
                  label="form.project.climateImpact.adaptingResilientBusinessModels.label"
                  name="climateImpact.adaptingResilientBusinessModels"
                  checked={values.climateImpact?.adaptingResilientBusinessModels ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.supportingClimateRelevantPolitics.help"
                  label="form.project.climateImpact.supportingClimateRelevantPolitics.label"
                  name="climateImpact.supportingClimateRelevantPolitics"
                  checked={values.climateImpact?.supportingClimateRelevantPolitics ?? false}
                />

                <Field component={FormikRTE}
                  className={useChangeAdaption ? "d-block" : "d-none"}
                  help="form.project.climateImpact.changeAdaption.help"
                  label="form.project.climateImpact.changeAdaption.label"
                  name="climateImpact.changeAdaption"
                  placeholder="form.project.climateImpact.changeAdaption.placeholder"
                  value={values.climateImpact?.changeAdaption ?? ""}
                />
              </Col>
            </Row>

            <h4>{t("form.project.climateImpact.collaborationImplementation.header")}</h4>
            <Row>
              <Col>
                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.educatingClimateKnowledge.help"
                  label="form.project.climateImpact.educatingClimateKnowledge.label"
                  name="climateImpact.educatingClimateKnowledge"
                  checked={values.climateImpact?.educatingClimateKnowledge ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.educatingClimateEmpowerment.help"
                  label="form.project.climateImpact.educatingClimateEmpowerment.label"
                  name="climateImpact.educatingClimateEmpowerment"
                  checked={values.climateImpact?.educatingClimateEmpowerment ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.supportingCollaboration.help"
                  label="form.project.climateImpact.supportingCollaboration.label"
                  name="climateImpact.supportingCollaboration"
                  checked={values.climateImpact?.supportingCollaboration ?? false}
                />

                <Field component={FormikCheckbox}
                  help="form.project.climateImpact.otherClimateImpacts.help"
                  label="form.project.climateImpact.otherClimateImpacts.label"
                  name="climateImpact.otherClimateImpacts"
                  checked={values.climateImpact?.otherClimateImpacts ?? false}
                />

                <Field component={FormikRTE}
                  className={useCollaborationImplementation ? "d-block" : "d-none"}
                  help="form.project.climateImpact.collaborationImplementation.help"
                  label="form.project.climateImpact.collaborationImplementation.label"
                  name="climateImpact.collaborationImplementation"
                  placeholder="form.project.climateImpact.collaborationImplementation.placeholder"
                  value={values.climateImpact?.collaborationImplementation ?? ""}
                />
              </Col>
            </Row>

            <div className="button-area">
              <Button className="btn-action btn-icon" type="submit" color="primary" disabled={isSubmitting}>
                <Icon name="save" size={18} />
                {t("form.saveChanges")} {isSubmitting && <Spinner />}
              </Button>
              <Link href={Routes.MY_PROJECTS} as={Routes.MY_PROJECTS + "#project-" + project.id}>
                <a className="btn btn-light">{t("goto.myProjects")}</a>
              </Link>
            </div>
          </CardBody>
        </Form>
      }}
    </Formik>
  </Card>
}

export default ClimateImpactForm
