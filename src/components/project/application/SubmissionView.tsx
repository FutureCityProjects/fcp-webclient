import React from "react"
import { Card, CardBody, CardHeader, Col, Row, UncontrolledCollapse } from "reactstrap"

import { IFund, IResourceRequirement, ISubmissionData, ResourceSourceType } from "api/schema"
import HtmlContent from "components/common/HtmlContent"
import Icon from "components/common/Icon"
import TranslatedHtml from "components/common/TranslatedHtml"
import { useTranslation } from "services/i18n"

interface IProps {
  fund: IFund
  submission: ISubmissionData
}

const SubmissionView: React.FC<IProps> = ({ submission, fund }: IProps) => {
  const { t } = useTranslation()

  const sumCosts = (requirements: IResourceRequirement[]): number =>
    requirements.reduce((s, r) => s + (r.cost || 0), 0)

  // workPackages are optional...
  const workPackages = submission.workPackages || []

  const unassignedTasks = submission.tasks.filter((task) => !task.workPackage)
  const unassignedTaskIds = unassignedTasks.map((task) => task.id)
  const unassignedResources = submission.resourceRequirements.filter((res) => unassignedTaskIds.includes(res.task))

  const total = sumCosts(submission.resourceRequirements)
  const fundingSum = sumCosts(submission.resourceRequirements.filter((r) => r.sourceType === ResourceSourceType.Funding))
  const proceedsSum = sumCosts(submission.resourceRequirements.filter((r) => r.sourceType === ResourceSourceType.Proceeds))
  const ownCostsSum = sumCosts(submission.resourceRequirements.filter((r) => r.sourceType === ResourceSourceType.OwnFunds))

  const getWorkPackageMonths = (id: string) => {
    const wpTasks = submission.tasks.filter((task) => task.workPackage === id)
    const months: number[] = []
    wpTasks.forEach((e) => months.push(...e.months))

    return months
      .filter((m, i, self) => self.indexOf(m) === i)
      .sort((a, b) => a > b ? 1 : -1)
  }

  const timetableHeaderCells = []
  for (let i = 1; i <= submission.implementationTime; i++) {
    timetableHeaderCells.push(<th key={i}>{i}</th>)
  }

  return <>
    <Card className="body-card">
      <CardHeader>
        <div className="title-section" >
          <h2>{submission.name}</h2>
        </div>
      </CardHeader>
      <CardBody>
        <p>{t("fundApplication.fund")}: {fund.name}</p>
        {submission.submissionDate &&
          <p>{t("fundApplication.submission.submissionDate")}: {t("default.longDate", { value: submission.submissionDate })}</p>
        }
        {submission.submittedBy && submission.submittedBy.username &&
          <p>
            {t("fundApplication.submission.submittedBy")}
            : {submission.submittedBy.firstName} {submission.submittedBy.lastName}
            {submission.submittedBy.firstName || submission.submittedBy.lastName
              ? " ("
              : ""}
            {submission.submittedBy.username}
            {submission.submittedBy.firstName || submission.submittedBy.lastName
              ? ")"
              : ""}
          </p>
        }

        <h3>{t("fundApplication.submission.generalHeader")}</h3>

        <p>
          {submission.holderName}<br />
          {submission.holderStreet}<br />
          {submission.holderAddressInfo && <>{submission.holderAddressInfo}<br /></>}
          {submission.holderZipCode} {submission.holderCity}
        </p>

        <p>
          {submission.contactName}<br />
          {t("project.contactPhone")}: {submission.contactPhone || t("default.empty")}<br />
          {t("project.contactEmail")}: {submission.contactEmail || t("default.empty")}<br />
        </p>

        <p>
          {t("fundApplication.requestedFunding")}: {t("default.currency", { value: submission.requestedFunding })}
        </p>
      </CardBody>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.projectHeader")}</h3>
        <div className={"icon-navigation"}>
          <a id={"toggler-project"}
            className="toggler navigation-item caret"
            onClick={() => document.getElementById("caret-project").classList.toggle("caret-toggled")}
          >
            <span id={"caret-project"} className="caret-toggled"><Icon name="caret" size={24} /></span>
          </a>
        </div>
      </CardHeader>
      <UncontrolledCollapse toggler={"#toggler-project"} defaultOpen={true}>
        <CardBody>

          <h4>{t("project.shortDescription")}</h4>
          {submission.shortDescription}

          <h4>{t("project.description")}</h4>
          <div className="rte-content">
            <HtmlContent content={submission.description} />
          </div>

          <h4>{t("project.goal")}</h4>
          <div className="rte-content">
            <HtmlContent content={submission.goal} />
          </div>

          <h4>{t("project.challenges")}</h4>
          <div className="rte-content">
            <HtmlContent content={submission.challenges} />
          </div>

          <h4>{t("project.vision")}</h4>
          <div className="rte-content">
            <HtmlContent content={submission.vision} />
          </div>

          <h4>{t("project.delimitation")}</h4>
          <div className="rte-content">
            <HtmlContent content={submission.delimitation} />
          </div>
        </CardBody>
      </UncontrolledCollapse>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.concretizationHeader")}</h3>
        <div className={"icon-navigation"}>
          <a id={"toggler-concretization"}
            className="toggler navigation-item caret"
            onClick={() => document.getElementById("caret-concretization").classList.toggle("caret-toggled")}
          >
            <span id={"caret-concretization"} className="caret-toggled"><Icon name="caret" size={24} /></span>
          </a>
        </div>
      </CardHeader>
      <UncontrolledCollapse toggler={"#toggler-concretization"} defaultOpen={true}>
        <CardBody>
          {fund.concretizations.map((concretization) => {
            const answer = submission.concretizations[concretization.id]

            return <React.Fragment key={concretization.id}>
              <h4>{concretization.question}</h4>
              <div className="rte-content">
                <HtmlContent content={answer} />
              </div>
            </React.Fragment>
          })}
        </CardBody>
      </UncontrolledCollapse>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.resultsHeader")}</h3>
        <div className={"icon-navigation"}>
          <a id={"toggler-results"}
            className="toggler navigation-item caret"
            onClick={() => document.getElementById("caret-results").classList.toggle("caret-toggled")}
          >
            <span id={"caret-results"} className="caret-toggled"><Icon name="caret" size={24} /></span>
          </a>
        </div>
      </CardHeader>
      <UncontrolledCollapse toggler={"#toggler-results"} defaultOpen={true}>
        <CardBody>
          <h4>{t("project.targetGroups")}</h4>
          <ul>
            {(submission.targetGroups || []).map((group, i) => <li key={i}>
              {group}
            </li>)}
          </ul>

          <h4>{t("project.results")}</h4>
          <ul>
            {(submission.results || []).map((result, i) => <li key={i}>
              {result}
            </li>)}
          </ul>

          <h4>{t("project.impact")}</h4>
          <ul>
            {(submission.impact || []).map((impact, i) => <li key={i}>
              {impact}
            </li>)}
          </ul>

          <h4>{t("project.outcome")}</h4>
          <ul>
            {(submission.outcome || []).map((outcome, i) => <li key={i}>
              {outcome}
            </li>)}
          </ul>

          <h4>{t("project.utilization")}</h4>
          <div className="rte-content">
            <HtmlContent content={submission.utilization} />
          </div>
        </CardBody>
      </UncontrolledCollapse>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.workPlanHeader")}</h3>
        <div className={"icon-navigation"}>
          <a id={"toggler-work"}
            className="toggler navigation-item caret"
            onClick={() => document.getElementById("caret-work").classList.toggle("caret-toggled")}
          >
            <span id={"caret-work"} className="caret-toggled"><Icon name="caret" size={24} /></span>
          </a>
        </div>
      </CardHeader>
      <UncontrolledCollapse toggler={"#toggler-work"} defaultOpen={true}>
        <CardBody>
          {workPackages.map((wp) => {
            const tasks = submission.tasks.filter((task) => task.workPackage === wp.id)

            return <div key={wp.id}>
              <h4>{t("project.workPackage.abbreviation")}{wp.order}: {wp.name}</h4>
              <Row>
                <Col lg={4}>
                  {wp.mainResponsibility && <>{t("project.workPackage.mainResponsibility")}: {wp.mainResponsibility}</>}
                  {wp.description && <p>{wp.description}</p>}
                </Col>
                <Col lg={8}>
                  <h5>{t("project.tasks")}</h5>
                  <ul>
                    {tasks.map((task, i) => <li key={i}>{task.description}</li>)}
                  </ul>
                </Col>
              </Row>
            </div>
          })}

          {unassignedTasks.length > 0 && <>
            <h4>{t("project.tasks")}</h4>
            <ul>
              {unassignedTasks.map((task, i) => <li key={i}>{task.description}</li>)}
            </ul>
          </>}
        </CardBody>
      </UncontrolledCollapse>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.timetable.header")}</h3>
        <div className={"icon-navigation"}>
          <a id={"toggler-timetable"}
            className="toggler navigation-item caret"
            onClick={() => document.getElementById("caret-timetable").classList.toggle("caret-toggled")}
          >
            <span id={"caret-timetable"} className="caret-toggled"><Icon name="caret" size={24} /></span>
          </a>
        </div>
      </CardHeader>
      <UncontrolledCollapse toggler={"#toggler-timetable"} defaultOpen={true}>
        <CardBody>
          {t("project.implementationBegin")}: {submission.implementationBegin
            ? <TranslatedHtml content="default.longMonthYear" params={{ value: submission.implementationBegin }} />
            : t("default.empty")}
          <br />
          {t("project.implementationTime")}: {submission.implementationTime
            ? t("default.months", { count: submission.implementationTime })
            : t("default.empty")} <br />

          <table className="submission-timetable package-timetable">
            <thead>
              <tr>
                <th className="first-col">{t("fundApplication.submission.timetable.months")}</th>
                {timetableHeaderCells}
              </tr>
            </thead>
            <tbody>
              {workPackages.map((wp) => {
                const wpCells = []
                const wpMonths = getWorkPackageMonths(wp.id)
                for (let i = 1; i <= submission.implementationTime; i++) {
                  wpCells.push(<td key={i} className={wpMonths.includes(i) ? "active" : "inactive"}></td>)
                }

                return <tr key={wp.id}>
                  <td className="first-col">{t("project.workPackage.abbreviation")}{wp.order}</td>
                  {wpCells}
                </tr>
              })}
            </tbody>
          </table>

          {unassignedTasks.length > 0 && <table className="submission-timetable">
            <thead>
              <tr>
                <th className="first-col">{t("fundApplication.submission.timetable.months")}</th>
                {timetableHeaderCells}
              </tr>
            </thead>
            <tbody>
              {unassignedTasks.map((task) => {
                const taskCells = []
                for (let i = 1; i <= submission.implementationTime; i++) {
                  taskCells.push(<td key={i} className={task.months.includes(i) ? "active" : "inactive"}></td>)
                }

                return <tr key={task.id}>
                  <td className="first-col">{task.description}</td>
                  {taskCells}
                </tr>
              })}
            </tbody>
          </table>}
        </CardBody>
      </UncontrolledCollapse>
    </Card>

    <Card className="body-card submission-finances">
      <CardHeader>
        <h3>{t("fundApplication.submission.financesHeader")}</h3>
        <div className={"icon-navigation"}>
          <a id={"toggler-finances"}
            className="toggler navigation-item caret"
            onClick={() => document.getElementById("caret-finances").classList.toggle("caret-toggled")}
          >
            <span id={"caret-finances"} className="caret-toggled"><Icon name="caret" size={24} /></span>
          </a>
        </div>
      </CardHeader>
      <UncontrolledCollapse toggler={"#toggler-finances"} defaultOpen={true}>
        <CardBody>
          {workPackages.map((wp) => {
            const tasks = submission.tasks.filter((task) => task.workPackage === wp.id)
            const taskIds = tasks.map((task) => task.id)
            const resources = submission.resourceRequirements.filter((res) => taskIds.includes(res.task))

            return <div key={wp.id}>
              <h4>{t("project.workPackage.abbreviation")}{wp.order}: {wp.name}</h4>
              {resources.map((resource) => <Row className="resource-requirement-row" key={resource.id}>
                <Col md={6}>
                  {resource.description}
                </Col>
                <Col md={3}>
                  {resource.source}
                  {resource.source && resource.sourceType && " ("}
                  {resource.sourceType && t("resourceRequirement.sourceType." + resource.sourceType)}
                  {resource.source && resource.sourceType && ")"}
                </Col>
                <Col md={3} className="text-md-right">
                  {t("default.currency", { value: resource.cost })}
                </Col>
              </Row>
              )}
            </div>
          })}

          {unassignedResources.length > 0 && <>
            <h4>{t("project.resourceRequirements")}</h4>
            {unassignedResources.map((resource) => <Row className="resource-requirement-row" key={resource.id}>
              <Col md={6}>
                {resource.description}
              </Col>
              <Col md={3}>
                {resource.source
                } {resource.sourceType && t("resourceRequirement.sourceType." + resource.sourceType)}

              </Col>
              <Col md={3} className="text-md-right">
                {t("default.currency", { value: resource.cost })}
              </Col>
            </Row>)}
          </>}

          <Row className="funding-sum">
            <Col md={6} />
            <Col md={3} className="text-md-right">
              {t("project.resourceRequirement.fundingSum")}:
          </Col>
            <Col md={3} className="text-md-right">
              {t("default.currency", { value: fundingSum })}
            </Col>
          </Row>
          <Row className="own-costs-sum">
            <Col md={6} />
            <Col md={3} className="text-md-right">
              {t("project.resourceRequirement.ownCostsSum")}:
          </Col>
            <Col md={3} className="text-md-right">
              {t("default.currency", { value: ownCostsSum })}
            </Col>
          </Row>
          <Row className="proceeds-sum">
            <Col md={6} />
            <Col md={3} className="text-md-right">
              {t("project.resourceRequirement.proceedsSum")}:
          </Col>
            <Col md={3} className="text-md-right">
              {t("default.currency", { value: proceedsSum })}
            </Col>
          </Row>
          <Row className="total-sum">
            <Col md={6} />
            <Col md={3} className="text-md-right">
              {t("project.resourceRequirement.totalSum")}:
          </Col>
            <Col md={3} className="text-md-right">
              {t("default.currency", { value: total })}
            </Col>
          </Row>
        </CardBody>
      </UncontrolledCollapse>
    </Card>
  </>
}

export default SubmissionView
