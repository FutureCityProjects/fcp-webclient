import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Popover, PopoverBody, PopoverHeader } from "reactstrap"

import { IProjectTask } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import { useTranslation } from "services/i18n"
import { validateTask } from "services/validation"

interface IProps {
  header: string
  onSubmit: any
  popoverOpen: boolean
  target: string
  toggle: any
}

const TaskPopover: React.FC<IProps> = (props: IProps) => {
  const { header, onSubmit, toggle, target, popoverOpen } = props
  const { t } = useTranslation()

  return <Popover
    className="task-popover-container"
    isOpen={popoverOpen}
    placement="right"
    target={target}
    toggle={toggle}
    trigger="legacy"
  >
    <PopoverHeader>{t(header)}</PopoverHeader>
    <PopoverBody>
      <Formik<IProjectTask>
        initialValues={{ description: "" }}
        onSubmit={(values) => {
          onSubmit(values)
          toggle()
        }}
        validate={validateTask}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({
          values,
          handleSubmit,
        }) => <Form className="task-popover-form" onSubmit={handleSubmit}>
            <Field component={FormikInput}
              label=""
              maxLength={500}
              minLength={5}
              name="description"
              placeholder="form.project.task.description.placeholder"
              value={values.description}
              required
            />

            <div className="button-area">
              <Button color="primary" type="submit">{t("form.save")}</Button>
              <Button color="light" onClick={toggle}>{t("form.cancel")}</Button>
            </div>
          </Form>
        }
      </Formik>
    </PopoverBody>
  </Popover>
}

export default TaskPopover
