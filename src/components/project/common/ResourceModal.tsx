import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"

import { IRessourceRequirement } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import { useTranslation } from "services/i18n"
import { validateResourceRequirement } from "services/validation"

interface IProps {
  header: string
  modalOpen: boolean
  onSubmit: any
  toggle: any
  resource?: IRessourceRequirement
}

const ResourceModal: React.FC<IProps> = (props: IProps) => {
  const { header, modalOpen, onSubmit, toggle } = props
  const { resource = { description: "", cost: 0 } } = props
  const { t } = useTranslation()

  return <Modal isOpen={modalOpen} toggle={toggle} className="resource-form-container">
    <ModalHeader>
      {t(header)}
    </ModalHeader>
    <ModalBody>
      <Formik<IRessourceRequirement>
        initialValues={resource}
        onSubmit={(values) => {
          onSubmit(values)
          toggle()
        }}
        validate={validateResourceRequirement}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({
          handleSubmit,
          values,
        }) => <Form className="work-package-form" onSubmit={handleSubmit}>
            <Field component={FormikInput}
              help="form.project.resourceRequirement.description.help"
              label="project.resourceRequirements.description"
              maxLength={280}
              minLength={5}
              name="description"
              placeholder="form.project.resourceRequirement.description.placeholder"
              required
              value={values.description}
            />

            <Field component={FormikInput}
              help="form.project.resourceRequirement.cost.help"
              label="project.resourceRequirements.cost"
              min={0}
              max={99999999}
              name="cost"
              placeholder="form.project.resource.cost.placeholder"
              type="number"
              value={values.cost}
            />

            <div className="button-area">
              <Button color="primary" type="submit">{t("form.save")}</Button>
              <Button color="light" onClick={toggle}>{t("form.cancel")}</Button>
            </div>
          </Form>
        }
      </Formik>
    </ModalBody>
  </Modal>
}

export default ResourceModal
