import React from "react"

import { IProcess } from "api/schema"

interface IProps {
  process: IProcess
}

export default function ProcessView({ process }: IProps) {
  return <>
    <h1>Prozess: {process.name}</h1>
    <h3>Description</h3>
    <div className=""><div dangerouslySetInnerHTML={{ __html: process.description }} /></div>

    <h3>Region</h3>
    <p>{process.region}</p>

    <h3>Goals</h3>
    {process.goals
      ? <ul>
        {process.goals.map((goal, index) => <li key={index}>{goal}</li>)}
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
    <div className=""><div dangerouslySetInnerHTML={{ __html: process.imprint }} /></div>
  </>
}
