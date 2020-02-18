import React from "react"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"

import { IFund, ISubmissionData } from "api/schema"
import HtmlContent from "components/common/HtmlContent"
import { useTranslation } from "services/i18n"

interface IProps {
  fund: IFund
  submission: ISubmissionData
}

const SubmissionView: React.FC<IProps> = ({ submission, fund }: IProps) => {
  const { t } = useTranslation()

  const unassignedTasks = submission.tasks.filter((task) => !task.workPackage)
  const unassignedTaskIds = unassignedTasks.map((task) => task.id)
  const unassignedResources = submission.resourceRequirements.filter((res) => unassignedTaskIds.includes(res.task))

  return <>
    <Card className="body-card">
      <CardHeader>
        <div className="title-section" >
          <h2>{submission.name}</h2>
        </div>
      </CardHeader>
      <CardBody>
        <h3>{t("fundApplication.submission.generalHeader")}</h3>
        <p>{t("fundApplication.fund")}: {fund.name}</p>
        <p>
          {submission.holderName}<br />
          {submission.holderStreet}<br />
          {submission.holderAddressInfo && <>{submission.holderAddressInfo}<br /></>}
          {submission.holderZipCode} {submission.holderCity}
        </p>

        <p>
          {submission.contactName}<br />
          {t("project.contactPhone")}: {submission.contactPhone}<br />
          {t("project.contactEmail")}: {submission.contactEmail}<br />
        </p>

        <p>
          {t("fundApplication.requestedFunding")}: {t("default.currency", { value: submission.requestedFunding })}
        </p>
      </CardBody>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.projectHeader")}</h3>
      </CardHeader>
      <CardBody>

        <h4>{t("project.shortDescription")}</h4>
        {submission.shortDescription}

        <h4>{t("project.description")}</h4>
        <HtmlContent content={submission.description} />

        <h4>{t("project.goal")}</h4>
        <HtmlContent content={submission.goal} />

        <h4>{t("project.challenges")}</h4>
        <HtmlContent content={submission.challenges} />

        <h4>{t("project.vision")}</h4>
        <HtmlContent content={submission.vision} />

        <h4>{t("project.delimitation")}</h4>
        <HtmlContent content={submission.delimitation} />

        <h3>{t("fundApplication.submission.concretizationHeader")}</h3>

        {fund.concretizations.map((concretization) => {
          const answer = submission.concretizations[concretization.id]

          return <>
            <h4>{concretization.question}</h4>
            <HtmlContent content={answer} />
          </>
        })}
      </CardBody>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.resultsHeader")}</h3>
      </CardHeader>
      <CardBody>

        <h4>{t("project.targetGroups")}</h4>
        <ul>
          {submission.targetGroups.map((group) => <li>
            {group}
          </li>)}
        </ul>

        <h4>{t("project.results")}</h4>
        <ul>
          {submission.results.map((result) => <li>
            {result}
          </li>)}
        </ul>

        <h4>{t("project.impact")}</h4>
        <ul>
          {submission.impact.map((impact) => <li>
            {impact}
          </li>)}
        </ul>

        <h4>{t("project.outcome")}</h4>
        <ul>
          {submission.outcome.map((outcome) => <li>
            {outcome}
          </li>)}
        </ul>

        <h4>{t("project.utilization")}</h4>
        <HtmlContent content={submission.utilization} />

      </CardBody>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.workPlanHeader")}</h3>
      </CardHeader>
      <CardBody>
        {submission.workPackages.map((wp) => {
          const tasks = submission.tasks.filter((task) => task.workPackage === wp.id)

          return <>
            <h4>{t("project.workPackage.abbreviation")}{wp.order}: {wp.name}</h4>
            <Row>
              <Col lg={4}>
                {wp.mainResponsibility && <>{t("project.workPackage.mainResponsibility")}: {wp.mainResponsibility}</>}
                {wp.description && <p>{wp.description}</p>}
              </Col>
              <Col lg={8}>
                <h5>{t("project.tasks")}</h5>
                <ul>
                  {tasks.map((task) => <li>{task.description}</li>)}
                </ul>
              </Col>
            </Row>
          </>
        })}

        {unassignedTasks.length > 0 && <>
          <h4>{t("project.tasks")}</h4>
          <ul>
            {unassignedTasks.map((task) => <li>{task.description}</li>)}
          </ul>
        </>}
      </CardBody>
    </Card>

    <Card className="body-card">
      <CardHeader>
        <h3>{t("fundApplication.submission.financesHeader")}</h3>
      </CardHeader>
      <CardBody>
        {submission.workPackages.map((wp) => {
          const tasks = submission.tasks.filter((task) => task.workPackage === wp.id)
          const taskIds = tasks.map((task) => task.id)
          const resources = submission.resourceRequirements.filter((res) => taskIds.includes(res.task))

          return <>
            <h4>{t("project.workPackage.abbreviation")}{wp.order}: {wp.name}</h4>
            {resources.map((resource) => <Row>
              <Col lg={6}>
                {resource.description}
              </Col>
              <Col lg={3}>
                {resource.source}
                {resource.sourceType}
              </Col>
              <Col lg={3}>
                {t("default.currency", { value: resource.cost })}
              </Col>
            </Row>
            )}
          </>
        })}

        {unassignedResources.length > 0 && <>
          <h4>{t("project.resourceRequirements")}</h4>
          <ul>
            {unassignedResources.map((resource) => <Row>
              <Col lg={6}>
                {resource.description}
              </Col>
              <Col lg={3}>
                {resource.source}
                {resource.sourceType}
              </Col>
              <Col lg={3}>
                {t("default.currency", { value: resource.cost })}
              </Col>
            </Row>)}
          </ul>
        </>}
      </CardBody>
    </Card>
  </>
}

export default SubmissionView
