import uniqueId from "lodash/uniqueId"
import { WithTranslation } from "next-i18next"
import React from "react"
import "react-quill/dist/quill.snow.css"
import { UncontrolledTooltip } from "reactstrap"

import { withTranslation } from "services/i18n"

interface IProps extends WithTranslation {
  value: string
  onChange: (value: string) => void
}

const CustomToolbar = ({ id, t }: { id: string, t: any }) => (
  <div id={id}>
    <span className="ql-formats">
      <select className="ql-size" defaultValue="" >
        <option value="small"></option>
        <option></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      {/* @todo "ql-size- + id" does not work here while a simple ID does, why? */}
      <UncontrolledTooltip placement="top" target={".ql-size"}>
        {t("RTE.size")}
      </UncontrolledTooltip>
    </span>

    <span className="ql-formats">
      <button type="button" className="ql-bold" id={"ql-bold-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-bold-" + id}>
        {t("RTE.bold")}
      </UncontrolledTooltip>

      <button type="button" className="ql-italic" id={"ql-italic-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-italic-" + id}>
        {t("RTE.italic")}
      </UncontrolledTooltip>

      <button type="button" className="ql-underline" id={"ql-underline-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-underline-" + id}>
        {t("RTE.underline")}
      </UncontrolledTooltip>

      <button type="button" className="ql-strike" id={"ql-strike-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-strike-" + id}>
        {t("RTE.strike")}
      </UncontrolledTooltip>
    </span>

    <span className="ql-formats">
      <button type="button" className="ql-list" id={"ql-list-ordered-" + id} value="ordered" />
      <UncontrolledTooltip placement="top" target={"ql-list-ordered-" + id}>
        {t("RTE.ordered")}
      </UncontrolledTooltip>

      <button type="button" className="ql-list" id={"ql-list-bullet-" + id} value="bullet" />
      <UncontrolledTooltip placement="top" target={"ql-list-bullet-" + id}>
        {t("RTE.bullet")}
      </UncontrolledTooltip>

      <button type="button" className="ql-link" id={"ql-link-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-link-" + id}>
        {t("RTE.link")}
      </UncontrolledTooltip>

      <button type="button" className="ql-clean" id={"ql-clean-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-clean-" + id}>
        {t("RTE.clean")}
      </UncontrolledTooltip>
    </span>
  </div>
)

class RTE extends React.Component<IProps> {
  public ReactQuill: any

  protected formats = [
    "size",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link",
  ]

  private id: string

  constructor(props: IProps) {
    super(props)
    this.id = uniqueId("qltoolbar-")
    if (typeof window !== "undefined") {
      this.ReactQuill = require("react-quill")
    }
  }

  public render() {
    const ReactQuill = this.ReactQuill

    return typeof window !== "undefined" && ReactQuill
      ? <>
        <CustomToolbar id={this.id} t={this.props.t} />
        <ReactQuill
          formats={this.formats}
          modules={{
            toolbar: {
              container: "#" + this.id,
            },
          }}
          themes="snow"
          {...this.props}
        />
      </>
      : <div />
  }
}

export default withTranslation("common")(RTE)
