import { Field, Formik } from "formik"
import React, { useState } from "react"
import { Button, Col, Form, Row } from "reactstrap"

import { IProject, IRessourceRequirement } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import FormikInputGroup from "components/common/form/FormikInputGroup"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { validateResourceRequirement } from "services/validation"
import { IPlanFunctions } from "../common/PlanContainer"

interface IProps {
  currentResource: string
  functions: IPlanFunctions
  isFirst: boolean
  project: IProject
}

const ResourceCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const toggleEdit = () => { setEditing(!editing) }

  const { currentResource, functions, isFirst } = props

  const resource = functions.getResourceRequirement(currentResource)

  const editForm = () => <Formik<IRessourceRequirement>
    initialValues={resource}
    onSubmit={(values) => {
      functions.updateResourceRequirement({ ...resource, ...values })
      toggleEdit()
    }}
    onReset={toggleEdit}
    validateOnChange={false}
    validateOnBlur={false}
    validate={validateResourceRequirement}
  >
    {({
      values,
      handleSubmit,
      handleReset
    }) => <Form onSubmit={handleSubmit}>
        <Row className="resource-card">
          <Col md={8} className="resource-description">
            <Row className={"resource-description-label" + (isFirst ? "" : " d-lg-none")}><h5>{t("project.resourceRequirements.description")}</h5></Row>
            <Row className="resource-description-content">
              <Field component={FormikInputGroup}
                addOn={<div className="icon-navigation">
                  <a className="navigation-item"
                    onClick={() => handleReset()}
                    title={t("form.cancel")}
                  ><Icon name="cancel" size={18} /></a>
                  <Button
                    className="navigation-item btn-inline"
                    color="none"
                    onClick={() => handleSubmit()}
                    title={t("form.save")}
                    type="submit"
                  >
                    <Icon name="save" size={18} />
                  </Button>
                </div>}
                label=""
                maxLength={280}
                minLength={5}
                name="description"
                placeholder="form.project.resourceRequirement.description.placeholder"
                required
                value={values.description}
              />
            </Row>
          </Col>
          <Col md={4} className="resource-cost">
            <Row className={"resource-cost-label" + (isFirst ? "" : " d-lg-none")}><h5>{t("project.resourceRequirements.cost")}</h5></Row>
            <Row className="resource-cost-content text-right">
              <Field component={FormikInput}
                label=""
                min={0}
                max={99999999}
                name="cost"
                placeholder="form.project.resourceRequirement.cost.placeholder"
                type="number"
                value={values.cost || 0}
              />
            </Row>
          </Col>
        </Row>
      </Form>
    }
  </Formik>

  return <>
    {editing ? editForm() : <Row className="resource-card">
      <Col md={8} className="resource-description">
        <Row className={"resource-description-label" + (isFirst ? "" : " d-lg-none")
        }> <h5>{t("project.resourceRequirements.description")}</h5></Row >
        <Row className="resource-description-content">
          <div className="icon-navigation">
            <a className="navigation-item"
              onClick={toggleEdit}
              title={t("form.edit")}
            ><Icon name="pencil" size={18} /></a>
            <a className="navigation-item"
              onClick={() => functions.removeResourceRequirement(currentResource)}
              title={t("form.removeElement")}
            ><Icon name="trash" size={18} /></a>
          </div>
          {resource.description}
        </Row>
      </Col >
      <Col md={4} className="resource-cost">
        <Row className={"resource-cost-label" + (isFirst ? "" : " d-lg-none")}><h5>{t("project.resourceRequirements.cost")}</h5></Row>
        <Row className="resource-cost-content text-right">{t("default.currency", { value: resource.cost })}</Row>
      </Col>
    </Row >
    }</>
}

export default ResourceCard