import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserSurveys from "./UserSurveys/UserSurveys";
import FundSurvey from "./FundSurvey/FundSurvey";
import ViewSurveyDetails from "./ViewSurveyDetails/ViewSurveyDetails";

export default function Surveys(props) {
  const [view, setView] = useState("list");
  const [rewardPools, setRewardPools] = useState([]);
  const [targetPool, setTargetRewardPool] = useState({});

  let content;
  switch (view) {
    case "fund":
      content = <FundSurvey onViewChange={setView} token={props.token} />;
      break;
    case "details":
      content = (
        <ViewSurveyDetails rewardPool={targetPool} onViewChange={setView} />
      );
      break;
    default:
      content = (
        <UserSurveys
          rewardPools={rewardPools}
          onSurveySelect={setTargetRewardPool}
          onViewChange={setView}
        />
      );
      break;
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Surveys</h2>
        </Col>
      </Row>
      <Row>
        <Col>{content}</Col>
      </Row>
    </Container>
  );
}
