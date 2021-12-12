import React from "react";
import { Card, Container, Row, Button, Col, ListGroup } from "react-bootstrap";
import { VictoryPie } from "victory";

export default function ViewSurveyDetails(props) {
  // TODO: use props reward pool object
  const pool = {
    active: true,
    total_rewarded: 300,
    total_earned: 500,
    total_funds: 1000,
    responses: 300,
    response_reward: 1,
    title: "Dummy Survey",
  };

  let data = [
    { x: "rewarded", y: pool.total_rewarded },
    {
      x: "uncollected",
      y: pool.total_earned - pool.total_rewarded,
    },
    {
      x: "pending",
      y: pool.total_funds - pool.total_earned,
    },
  ];
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Container fluid>
            <Row>
              <Col>
                {pool.title} | {pool.active ? "Open" : "Closed"}
              </Col>
              <Col xs="auto">
                <Button variant="success">Add Funds</Button>
                <Button variant="danger">Close Pool</Button>
              </Col>
            </Row>
          </Container>
        </Card.Title>
        <Container fluid>
          <Row>
            <Col xs={12} lg={6}>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <h5>Breakdown</h5>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <VictoryPie
                    data={data}
                    padding={80}
                    innerRadius={90}
                    colorScale={["#9944DE", "#F72585", "#D5D7F4"]}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <ListGroup>
                    <ListGroup.Item>
                      Rewarded: {(pool.total_rewarded / pool.total_funds) * 100}
                      %
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Uncollected:{" "}
                      {((pool.total_earned - pool.total_rewarded) /
                        pool.total_funds) *
                        100}
                      %
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Pending:{" "}
                      {((pool.total_funds - pool.total_earned) /
                        pool.total_funds) *
                        100}
                      %
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
            <Col xs={12} lg={6}>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <h5>Statistics</h5>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <ListGroup>
                    <ListGroup.Item>
                      Reward Pool Total: {pool.total_funds}Ξ
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Total Rewarded: {pool.total_rewarded}Ξ
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Total Earned: {pool.total_earned}Ξ
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Total Uncollected:{" "}
                      {pool.total_earned - pool.total_rewarded}Ξ
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col lg={6}>
                  <ListGroup>
                    <ListGroup.Item>
                      Response Reward: {pool.response_reward}Ξ
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Rewarded Responses: {pool.responses}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}
