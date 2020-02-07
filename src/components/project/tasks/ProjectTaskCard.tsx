import { Field, Form, Formik } from "formik"
import React, { useState } from "react"
import { Card, CardBody } from "reactstrap"

import { IProjectTask } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"
import { validateTask } from "services/validation"

interface IProps {
  task: IProjectTask
  onDelete: any
  onUpdate: any
}

const ProjectTaskCard: React.FC<IProps> = ({ task, onDelete, onUpdate }: IProps) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const toggleEdit = () => { setEditing(!editing) }

  const taskEditForm = () => <Formik<IProjectTask>
    initialValues={{ description: task.description }}
    onSubmit={(values) => {
      onUpdate(task.id, values.description)
      toggleEdit()
    }}
    onReset={toggleEdit}
    validateOnChange={false}
    validateOnBlur={false}
    validate={validateTask}
  >
    {({
      values,
      handleSubmit,
      handleReset
    }) => <Form onSubmit={handleSubmit}>
        <Field
          component={FormikInput}
          label=""
          name="description"
          maxLength={500}
          minLength={5}
          onKeyDown={(event) => {
            if (event.keyCode === 27) handleReset()
          }}
          required
          value={values.description}
        />

        <div className="icon-navigation">
          <a className="navigation-item"
            onClick={() => handleReset()}
            title={t("form.cancel")}
          ><Icon name="cancel" size={18} /></a>
          <a className="navigation-item"
            onClick={() => handleSubmit()}
            title={t("form.save")}
          ><Icon name="save" size={18} /></a>
        </div>
      </Form>
    }
  </Formik>

  return <Card className="task-card">
    <CardBody>
      {editing
        ? taskEditForm()
        : <>
          <div className="icon-navigation">
            <a className="navigation-item"
              onClick={() => onDelete(task.id)}
              title={t("form.removeElement")}
            ><Icon name="trash" size={18} /></a>
            <a className="navigation-item"
              onClick={toggleEdit}
              title={t("form.edit")}
            ><Icon name="pencil" size={18} /></a>
          </div>
          <p>{task.description}</p>
        </>
      }
    </CardBody>
  </Card>
}

export default ProjectTaskCard
