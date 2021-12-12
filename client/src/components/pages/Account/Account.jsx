import React, { useState } from "react";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import Info from "./Info/Info";
import Connections from "./Connections/Connections";

export default function Account(props) {
  const [tab, setTab] = useState("info");
  const [userToken] = useState(props.token);
  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Account</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            id="account-tabs"
            activeKey={tab}
            onSelect={(t) => setTab(t)}
            className="mb-3"
          >
            <Tab eventKey="info" title="Info">
              <Info token={userToken} />
            </Tab>
            <Tab eventKey="connections" title="Connections">
              <Connections token={userToken} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
