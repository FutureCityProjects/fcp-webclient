import { Field, Form, Formik } from "formik"
import React, { useState } from "react"
import { Card, CardBody } from "reactstrap"

import { IProjectTask } from "api/schema"
import FormikInput from "components/common/form/FormikInput"
import Icon from "components/common/Icon"

interface IProps {
  task: IProjectTask
  onDelete: any
  onUpdate: any
}

const ProjectTaskCard: React.FC<IProps> = ({ task, onDelete, onUpdate }: IProps) => {
  const [editing, setEditing] = useState(false)

  const toggleEdit = () => { setEditing(!editing) }

  const validate = (values: IProjectTask) => {
    const errors: { [key: string]: string } = {}

    const description = values.description.trim()
    if (description.length > 0 && description.length < 6) {
      errors.description = "validate.general.tooShort"
    }

    return errors
  }

  const taskEditForm = () => {
    return <Formik<IProjectTask>
      initialValues={{ description: task.description }}
      onSubmit={(values) => {
        const description = values.description.trim()
        if (description.length) {
          onUpdate(task.id, description)
        } else {
          onDelete(task.id)
        }
        toggleEdit()
      }}
      onReset={toggleEdit}
      validateOnChange={false}
      validateOnBlur={false}
      validate={validate}
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
            onKeyDown={(event) => {
              if (event.keyCode === 27) handleReset()
            }}
            value={values.description}
          />
          <div className="icon-navigation">
            <a onClick={() => handleReset()} className="navigation-item"><Icon name="cancel" size={18} /></a>
            <a onClick={() => handleSubmit()} className="navigation-item"><Icon name="save" size={18} /></a>
          </div>
        </Form>
      }
    </Formik>
  }

  return (
    <Card className="task-card">
      <CardBody>
        {editing
          ? taskEditForm()
          : <>
            <p>{task.description}</p>
            <div className="icon-navigation">
              <a onClick={() => onDelete(task.id)} className="navigation-item"><Icon name="trash" size={18} /></a>
              <a onClick={toggleEdit} className="navigation-item"><Icon name="pencil" size={18} /></a>
            </div>
          </>
        }
      </CardBody>
    </Card>
  )
}

export default ProjectTaskCard
