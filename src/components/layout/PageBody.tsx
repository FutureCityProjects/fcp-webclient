import React from "react"

const PageBody: React.FC = (props: any) => <main className="container" role="main">
  {props.children}
</main>

export default PageBody