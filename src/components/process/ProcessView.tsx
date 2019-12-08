import React from "react"

import { IProcess } from "api/schema"

interface IProps {
  process: IProcess
}

export default function ProcessView({ process }: IProps) {
  return <>
    <h1>Prozess: {process.name}</h1>
    <h3>Description</h3>
    <p><div dangerouslySetInnerHTML={{ __html: process.description }} /></p>

    <h3>Region</h3>
    <p>{process.region}</p>

    <h3>Targets</h3>
    {process.targets
      ? <ul>
        {process.targets.map((target, index) => <li key={index}>{target}</li>)}
      </ul>
      : <p>--none--</p>
    }

    <h3>Criteria</h3>
    {process.criteria
      ? <ul>
        {process.criteria.map((criteria, index) => <li key={index}>{criteria}</li>)}
      </ul>
      : <p>--none--</p>
    }

    <h3>Imprint</h3>
    <p><div dangerouslySetInnerHTML={{ __html: process.imprint }} /></p>
  </>
}
