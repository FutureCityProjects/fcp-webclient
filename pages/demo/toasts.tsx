import { WithTranslation } from "next-i18next"
import React from "react"
import { toast } from "react-toastify"
import { Col, Row, Card, Spinner, Button, CardBody, CardHeader, Label } from "reactstrap"

import BaseLayout from "components/BaseLayout"
import { I18nPage, includeDefaultNamespaces, withTranslation } from "services/i18n"

type PageProps = WithTranslation

const Page: I18nPage<PageProps> = () => {
  return (
    <BaseLayout pageTitle="Toasts" >
      <Row>
        <Col>
          Einige statische Toasts als Hilfe beim Styling<br />
          <Spinner />

          <Card>
            <CardBody>
              <div className="form-group">
                <Label>Test</Label>
                <input className="form-control"></input>
              </div>
              <div className="form-group">
                <Button color="primary" className="btn-action">
                  Absenden
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                <Button color="primary" className="btn-action">
                  Absenden <Spinner />
                </Button>
                &nbsp;
                <Button color="primary">
                  Absenden <Spinner />
                </Button>
                &nbsp;
                <Button color="primary" className="btn-sm">
                  Absenden <Spinner />
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                <Button color="secondary" className="btn-action">
                  Absenden <Spinner />
                </Button>
                &nbsp;
                &nbsp;
                &nbsp;
                <Button color="light" className="btn-action">
                  Absenden <Spinner />
                </Button>
              </div>
            </CardBody>

          </Card>

          <Card>
            <CardHeader>Loading Card</CardHeader>
            <CardBody>
              <Spinner />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </BaseLayout>
  )
}

Page.getInitialProps = async () => {
  toast("Alles ist ok", { autoClose: false, type: "success" })
  toast("Erste Warnung", { autoClose: false, type: "warning" })
  toast("Alles kaputt", { autoClose: false, type: "error" })
  toast("Nur zur Info", { autoClose: false, type: "info" })
  toast("Back to normal", { autoClose: false, type: "default" })

  toast("Verschwindet nach 30s", { autoClose: 30000, type: "success" })
  toast("Verschwindet nach 20s", { autoClose: 20000, type: "default" })
  return {

    namespacesRequired: includeDefaultNamespaces(),
  }
}

export default withTranslation(includeDefaultNamespaces())(Page)
