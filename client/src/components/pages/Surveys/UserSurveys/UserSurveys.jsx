import Dropdown from "@restart/ui/esm/Dropdown";
import React, { useState, useEffect } from "react";
import {
  Card,
  DropdownButton,
  Table,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";

export default function UserSurveys(props) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Container fluid>
            <Row>
              <Col>Survey Reward Pools </Col>
              <Col xs="auto">
                <Button
                  variant="warning"
                  onClick={() => props.onViewChange("fund")}
                >
                  +Fund Survey
                </Button>
              </Col>
            </Row>
          </Container>
        </Card.Title>
        <Table>
          <thead>
            <tr>
              <th>Survey</th>
              <th>Status</th>
              <th>Reward Pool</th>
              <th>Rewarded</th>
              <th>Responses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.rewardPools.map((pool) => (
              <tr>
                <td>{pool.title}</td>
                <td>{pool.active ? "Open" : "Closed"}</td>
                <td>{pool.total_funds}</td>
                <td>{pool.total_rewarded}</td>
                <td>{pool.responses}</td>
                <td>
                  <DropdownButton variant="info" title="More">
                    <Dropdown.Item eventKey={pool.id + "|view"}>
                      View
                    </Dropdown.Item>
                    <Dropdown.Item eventKey={pool.id + "|close"}>
                      Close
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
