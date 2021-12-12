import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Alert,
} from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Surveys from "../pages/Surveys/Surveys";
import Rewards from "../pages/Rewards/Rewards";
import Account from "../pages/Account/Account";
import { SERVER_URL } from "../../api/api";
import { extractAuth0UserID } from "../../utils/utils";

const Dashboard = () => {
  const [page, setPage] = useState("");
  const [userAccessToken, setUserAccessToken] = useState("");
  const [showSMConnectToast, setShowSMConnectToast] = useState(false);

  const { user, logout, getAccessTokenSilently } = useAuth0();
  // const userAccessToken = useAccessToken("read:current_user");

  const onSelectNavHandler = (e) => {
    setPage(e);
  };

  useEffect(() => {
    const getToken = async (scopes) => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: "https://dev-v-k6kda5.us.auth0.com/api/v2/",
          scope: scopes,
        });
        setUserAccessToken(accessToken);

        // if the url has a oauth2 callback code then send request
        // to backend to get and persist the permanent token.
        const path = window.location.pathname;
        if (path.split("/")[2] === "oauth2callback") {
          const search = window.location.search;
          const urlParams = new URLSearchParams(search);

          //var state = urlParams.get("state"); // TODO compare to initial request state to ensure it matches.
          var code = urlParams.get("code");

          fetch(SERVER_URL + "/oauth/token", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + accessToken,
            },
            body: JSON.stringify({
              user_id: extractAuth0UserID(user.sub),
              code: code,
            }),
          })
            .then((response) => {
              setShowSMConnectToast(true);
            })
            .catch((err) => {
              console.log(err);
              alert("Error: ", err);
            });

          // rest address bar url to avoid any repeated calls
          window.history.pushState("dashboard", "dashboard", "/dashboard");
        }
      } catch (e) {
        console.log(e);
      }
    };

    getToken("read:current_user");
  });

  let content = <h1>Welcome</h1>;
  switch (page) {
    case "surveys":
      content = <Surveys token={userAccessToken} />;
      break;
    case "rewards":
      content = <Rewards token={userAccessToken} />;
      break;
    case "account":
      content = <Account token={userAccessToken} />;
      break;
    default:
      break;
  }

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">ApeSurvey</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav onSelect={onSelectNavHandler} className="me-auto">
              <Nav.Link eventKey="surveys">Surveys</Nav.Link>
              <Nav.Link eventKey="rewards">Rewards</Nav.Link>
              <Nav.Link eventKey="account">Account</Nav.Link>
            </Nav>
            <Nav>
              <Button
                variant="light"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Alert
            key="sm-connected"
            show={showSMConnectToast}
            variant="success"
            dismissible
          >
            Success! Your SurveyMonkey account is now connected.
          </Alert>
        </Row>
        <Row>
          <Col>{content}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
