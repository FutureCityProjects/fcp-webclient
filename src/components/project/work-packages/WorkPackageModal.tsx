import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"

import { IWorkPackage } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import { useTranslation } from "services/i18n"
import { validateWorkPackage } from "services/validation"

interface IProps {
  header: string
  modalOpen: boolean
  onSubmit: any
  toggle: any
  workPackage?: IWorkPackage
}

const WorkPackageModal: React.FC<IProps> = (props: IProps) => {
  const { header, modalOpen, onSubmit, toggle } = props
  const { workPackage = {} } = props
  const { t } = useTranslation()

  return <Modal isOpen={modalOpen} toggle={toggle} className="work-package-form-container">
    <ModalHeader>
      {t(header)}
    </ModalHeader>
    <ModalBody>
      <Formik<IWorkPackage>
        initialValues={workPackage}
        onSubmit={(values) => {
          onSubmit(values)
          toggle()
        }}
        validate={validateWorkPackage}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({
          handleSubmit,
          values,
        }) => <Form className="work-package-form" onSubmit={handleSubmit}>
            <Field component={FormikInput}
              help="form.project.workPackage.name.help"
              label="project.workPackage.name"
              maxLength={100}
              minLength={2}
              name="name"
              placeholder="form.project.workPackage.name.placeholder"
              required
              value={values.name}
            />

            <Field component={FormikInput}
              help="form.project.workPackage.description.help"
              label="project.workPackage.description"
              maxLength={500}
              name="description"
              placeholder="form.project.workPackage.description.placeholder"
              type="textarea"
              value={values.description}
            />

            <Field component={FormikInput}
              help="form.project.workPackage.mainResponsibility.help"
              label="project.workPackage.mainResponsibility"
              maxLength={100}
              name="mainResponsibility"
              placeholder="form.project.workPackage.mainResponsibility.placeholder"
              value={values.mainResponsibility}
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

export default WorkPackageModal
