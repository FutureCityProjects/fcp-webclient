import { Field, Form, Formik } from "formik"
import React from "react"
import { Button, Card, CardBody } from "reactstrap"

import { IProjectTask } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { validateTask } from "services/validation"

interface IProps {
  onSubmit: any
}

const EmptyProjectTaskCard: React.FC<IProps> = ({ onSubmit }: IProps) => {
  const { t } = useTranslation()

  return <Card className="task-card empty-task-card">
    <CardBody>
      <Formik<IProjectTask>
        initialValues={{ description: "" }}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values)
          resetForm()
        }}
        enableReinitialize={true}
        validateOnChange={false}
        validateOnBlur={false}
        validate={validateTask}
      >
        {({
          values,
          handleSubmit
        }) => <Form onSubmit={handleSubmit}>
            <Field component={FormikInput}
              label=""
              name="description"
              maxLength={500}
              minLength={5}
              placeholder="form.project.task.description.placeholder"
              required
              value={values.description}
            />

            <Button
              aria-label={t("form.project.tasks.addTask")}
              className="btn-add"
              color="link"
              title={t("form.addElement")}
              type="submit"
            >
              <Icon name="plus" size={24} /> {t("project.task.label")}
            </Button>
          </Form>
        }
      </Formik>
    </CardBody>
  </Card>
}

export default EmptyProjectTaskCard
