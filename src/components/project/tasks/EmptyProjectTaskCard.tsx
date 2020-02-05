import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody } from "reactstrap"

import { IProjectTask } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import Icon from "components/common/Icon"

interface IProps {
  onSubmit: any
}

const EmptyProjectTaskCard: React.FC<IProps> = (props: IProps) => {
  const { onSubmit } = props
  const validate = (values: IProjectTask) => {
    const errors: { [key: string]: string } = {}

    const description = values.description.trim()
    if (description.length > 0 && description.length < 6) {
      errors.description = "validate.general.tooShort"
    }

    return errors
  }

  return (
    <Card className="task-card empty-task-card">
      <CardBody>
        <Formik<IProjectTask>
          initialValues={{ description: '' }}
          onSubmit={async (values, { resetForm }) => {
            const description = values.description.trim()
            if (description.length) {
              await onSubmit(description)
              resetForm()
            } else {
              resetForm()
              document.getElementById("description").focus()
            }
          }}
          enableReinitialize={true}
          validateOnChange={false}
          validateOnBlur={false}
          validate={validate}
        >
          {({
            values,
            handleSubmit
          }) => <Form onSubmit={handleSubmit}>
              <Field component={FormikInput}
                label=""
                name="description"
                placeholder="form.project.tasks.newTask"
                value={values.description}
              />
              <Button color="link" className="btn-add" type="submit">
                <Icon name="plus" size={24} />
              </Button>
            </Form>
          }
        </Formik>
      </CardBody>
    </Card>
  )
}

export default EmptyProjectTaskCard
