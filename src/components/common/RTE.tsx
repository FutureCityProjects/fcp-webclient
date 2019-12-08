import React, { Component } from "react"
import "react-quill/dist/quill.snow.css"

interface IProps {
  value: string
  onChange: (value: string) => void
}

export default class RTE extends Component<IProps> {
  public ReactQuill: any

  protected formats = [
    // "header",
    "size",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link",
  ]

  protected modules = {
    toolbar: [
      // [{ header: [3, 4, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  }

  constructor(props: IProps) {
    super(props)
    if (typeof window !== "undefined") {
      this.ReactQuill = require("react-quill")
    }
  }

  public render() {
    const ReactQuill = this.ReactQuill

    return typeof window !== "undefined" && ReactQuill
      ? <ReactQuill
        formats={this.formats}
        modules={this.modules}
        {...this.props}
      />
      : <div />
  }
}
