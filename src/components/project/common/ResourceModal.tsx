import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"

import { IResourceRequirement, ResourceSourceType } from "api/schema"
import FormikAutocomplete from "components/common/form/FormikAutocomplete"
import FormikInput from "components/common/form/FormikInput"
import FormikSelect from "components/common/form/FormikSelect"
import { useTranslation } from "services/i18n"
import { validateResourceRequirement } from "services/validation"

interface IProps {
  header: string
  modalOpen: boolean
  onSubmit: any
  sources?: any
  toggle: any
  resource?: IResourceRequirement
  showFinances?: boolean
}

const ResourceModal: React.FC<IProps> = (props: IProps) => {
  const { header, modalOpen, onSubmit, showFinances = false, sources, toggle } = props
  const { resource = { description: "", cost: 0 } } = props
  const { t } = useTranslation()

  return <Modal isOpen={modalOpen} toggle={toggle} className="resource-form-container">
    <ModalHeader>
      {t(header)}
    </ModalHeader>
    <ModalBody>
      <Formik<IResourceRequirement>
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
              label="project.resourceRequirement.description"
              maxLength={280}
              minLength={5}
              name="description"
              placeholder="form.project.resourceRequirement.description.placeholder"
              required
              value={values.description}
            />

            <Field component={FormikInput}
              help="form.project.resourceRequirement.cost.help"
              label="project.resourceRequirement.cost"
              min={0}
              max={99999999}
              name="cost"
              placeholder="form.project.resourceRequirement.cost.placeholder"
              step={0.01}
              type="number"
              value={values.cost}
            />

            {showFinances && <>
              <Field component={FormikSelect}
                help="form.project.resourceRequirement.sourceType.help"
                label="project.resourceRequirement.sourceType"
                name="sourceType"
                options={{
                  [t("form.project.resourceRequirement.sourceType.placeholder")]: "",
                  [t("resourceRequirement.sourceType." + ResourceSourceType.SOURCE_TYPE_OWN_FUNDS)]: ResourceSourceType.SOURCE_TYPE_OWN_FUNDS,
                  [t("resourceRequirement.sourceType." + ResourceSourceType.SOURCE_TYPE_FUNDING)]: ResourceSourceType.SOURCE_TYPE_FUNDING,
                  [t("resourceRequirement.sourceType." + ResourceSourceType.SOURCE_TYPE_PROCEEDS)]: ResourceSourceType.SOURCE_TYPE_PROCEEDS,
                }}
                value={values.sourceType}
              />

              <Field component={FormikAutocomplete}
                help="form.project.resourceRequirement.source.help"
                label="project.resourceRequirement.source"
                maxLength={280}
                name="source"
                options={sources}
                placeholder="form.project.resourceRequirement.source.placeholder"
                value={values.source}
              />
            </>}

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
