import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"

import { IProject } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import FormikMonth from "components/common/form/FormikMonth"
import { useTranslation } from "services/i18n"

interface IProps {
  implementationBegin: Date
  implementationTime: number
  onSubmit: any,
  toggle: any,
  modalOpen: boolean,
}

const ImplementationTimeForm: React.FC<IProps> = (props: IProps) => {
  const { implementationBegin, implementationTime, onSubmit, toggle, modalOpen } = props
  const { t } = useTranslation()

  return <Modal isOpen={modalOpen} toggle={toggle} className="work-package-form-container">
    <ModalHeader>
      {t("page.projects.plan.timetable.modalHeader")}
    </ModalHeader>
    <ModalBody>
      <Formik<IProject>
        initialValues={{
          implementationBegin,
          implementationTime,
        }}
        onSubmit={(values) => {
          onSubmit(values)
          toggle()
        }}
      >
        {({
          values,
          handleSubmit
        }) => {
          return <Form className="work-package-form" onSubmit={handleSubmit}>
            <Field
              component={FormikMonth}
              help="form.project.implementationBegin.help"
              label="project.implementationBegin"
              minDate={new Date()}
              name="implementationBegin"
              value={values.implementationBegin}
            />

            <Field
              component={FormikInput}
              help="form.project.implementationTime.help"
              label="project.implementationTime"
              name="implementationTime"
              min={1}
              type="number"
              value={values.implementationTime}
            />

            <div className="button-area">
              <Button color="primary" type="submit">{t("form.confirm")}</Button>
            </div>
          </Form>
        }}
      </Formik>
    </ModalBody>
  </Modal>
}

export default ImplementationTimeForm
