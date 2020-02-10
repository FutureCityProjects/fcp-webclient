import { Field, Formik } from "formik"
import React, { useState } from "react"
import { Button, Col, Form, Row } from "reactstrap"

import { IResourceRequirement } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import FormikInputGroup from "components/common/form/FormikInputGroup"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { validateResourceRequirement } from "services/validation"
import { IPlanFunctions } from "./PlanContainer"

interface IProps {
  functions: IPlanFunctions
  isFirst: boolean
  resourceRequirement: IResourceRequirement
  showFinances?: boolean
}

const ResourceCard: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const toggleEdit = () => { setEditing(!editing) }

  const { functions, isFirst, resourceRequirement, showFinances = false } = props

  const editForm = () => <Formik<IResourceRequirement>
    initialValues={resourceRequirement}
    onSubmit={(values) => {
      functions.updateResourceRequirement({ ...resourceRequirement, ...values })
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
        <Row className={"resource-card " + (isFirst ? "first-resource" : "")}>
          <Col md={showFinances ? 5 : 8} className="resource-description">
            <Row className={"resource-description-label d-lg-none d-xs-block " + (isFirst ? "" : "d-md-none")}>
              <h5>{t("project.resourceRequirement.description")}</h5>
            </Row>
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
          {showFinances && <Col md={4} className="resource-source">
            <Row className={"resource-source-label d-lg-none d-xs-block " + (isFirst ? "" : "d-md-none")}><h5>{t("project.resourceRequirement.source")}</h5></Row>
            <Row className="resource-source-content text-right">
              <Field component={FormikInput}
                label=""
                maxLength={280}
                name="source"
                placeholder="form.project.resourceRequirement.source.placeholder"
                value={values.source}
              />
            </Row>
          </Col>}
          <Col md={showFinances ? 3 : 4} className="resource-cost">
            <Row className={"resource-cost-label d-lg-none d-xs-block " + (isFirst ? "" : "d-md-none")}><h5>{t("project.resourceRequirement.cost")}</h5></Row>
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
    {editing ? editForm() : <Row className={"resource-card " + (isFirst ? "first-resource" : "")}>
      <Col md={showFinances ? 5 : 8} className="resource-description">
        <Row className={"resource-description-label d-lg-none d-xs-block " + (isFirst ? "" : "d-md-none")}> <h5>{t("project.resourceRequirement.description")}</h5></Row >
        <Row className={"resource-description-content " + (isFirst ? "first-resource" : "")}>
          <div className="icon-navigation">
            <a className="navigation-item"
              onClick={toggleEdit}
              title={t("form.edit")}
            ><Icon name="pencil" size={18} /></a>
            <a className="navigation-item"
              onClick={() => functions.removeResourceRequirement(resourceRequirement.id)}
              title={t("form.removeElement")}
            ><Icon name="trash" size={18} /></a>
          </div>
          {resourceRequirement.description}
        </Row>
      </Col >
      {showFinances && <Col md={4} className="resource-source">
        <Row className={"resource-source-label d-lg-none d-block " + (isFirst ? "" : "d-md-none")}><h5>{t("project.resourceRequirement.source")}</h5></Row>
        <Row className={"resource-source-content " + (isFirst ? "first-resource" : "")}>{resourceRequirement.source}</Row>
      </Col>}
      <Col md={showFinances ? 3 : 4} className="resource-cost">
        <Row className={"resource-cost-label text-md-right d-lg-none d-block " + (isFirst ? "" : "d-md-none")}><h5>{t("project.resourceRequirement.cost")}</h5></Row>
        <Row className={"resource-cost-content text-md-right d-block " + (isFirst ? "first-resource" : "")}>{t("default.currency", { value: resourceRequirement.cost })}</Row>
      </Col>
    </Row >
    }</>
}

export default ResourceCard