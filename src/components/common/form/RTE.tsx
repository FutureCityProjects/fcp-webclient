import dynamic from "next/dynamic"
import React from "react"
import "react-quill/dist/quill.snow.css"
import { UncontrolledTooltip } from "reactstrap"

import { useTranslation } from "services/i18n"

const formats = [
  "size",
  "bold", "italic", "underline", "strike",
  "list", "bullet",
  "link",
]

const CustomToolbar = ({ id, t }: { id: string, t: any }) => (
  <div id={"ql-toolbar-" + id}>
    <span className="ql-formats">
      <select className="ql-size" defaultValue="">
        <option value="small"></option>
        <option></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      {/* @todo "ql-size- + id" does not work here while a simple ID does, why? */}
      <UncontrolledTooltip placement="top" target={".ql-size"}>
        {t("form.RTE.size")}
      </UncontrolledTooltip>
    </span>

    <span className="ql-formats">
      <button type="button" className="ql-bold" id={"ql-bold-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-bold-" + id}>
        {t("form.RTE.bold")}
      </UncontrolledTooltip>

      <button type="button" className="ql-italic" id={"ql-italic-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-italic-" + id}>
        {t("form.RTE.italic")}
      </UncontrolledTooltip>

      <button type="button" className="ql-underline" id={"ql-underline-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-underline-" + id}>
        {t("form.RTE.underline")}
      </UncontrolledTooltip>

      <button type="button" className="ql-strike" id={"ql-strike-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-strike-" + id}>
        {t("form.RTE.strike")}
      </UncontrolledTooltip>
    </span>

    <span className="ql-formats">
      <button type="button" className="ql-list" id={"ql-list-ordered-" + id} value="ordered" />
      <UncontrolledTooltip placement="top" target={"ql-list-ordered-" + id}>
        {t("form.RTE.ordered")}
      </UncontrolledTooltip>

      <button type="button" className="ql-list" id={"ql-list-bullet-" + id} value="bullet" />
      <UncontrolledTooltip placement="top" target={"ql-list-bullet-" + id}>
        {t("form.RTE.bullet")}
      </UncontrolledTooltip>

      <button type="button" className="ql-link" id={"ql-link-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-link-" + id}>
        {t("form.RTE.link")}
      </UncontrolledTooltip>

      <button type="button" className="ql-clean" id={"ql-clean-" + id} />
      <UncontrolledTooltip placement="top" target={"ql-clean-" + id}>
        {t("form.RTE.clean")}
      </UncontrolledTooltip>
    </span>
  </div>
)

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
})

interface IProps {
  className?: string
  id: string
  onChange: (value: string) => void
  placeholder?: string
  value: string
}

const RTE: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  return <div className={"rte-container " + props.className}
    // do not use .ql-active, it is used internally and would break formatting
    onFocus={(e) => e.target.classList.add("rte-active")}
    onBlur={(e) => e.target.classList.remove("rte-active")}
  >
    <CustomToolbar id={props.id} t={t} />
    <ReactQuill
      formats={formats}
      modules={{
        toolbar: {
          container: "#ql-toolbar-" + props.id,
        },
      }}
      theme="snow"
      value={props.value}
      onChange={(value, _delta, _sources, _editor) => {
        // @todo shouldn't be done on each change, maybe only in validate() or server-side
        // if (editor.getText().trim().length === 0) {
        //  return props.onChange("")
        // }

        props.onChange(value)
      }}
      placeholder={props.placeholder ? t(props.placeholder) : null}
    />
  </div>
}

export default RTE
