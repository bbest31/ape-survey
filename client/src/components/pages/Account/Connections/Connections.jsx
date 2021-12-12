import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { SM_API_BASE, SERVER_URL } from "../../../../api/api";
// import { v4 } from "uuid";
import { extractAuth0UserID } from "../../../../utils/utils";

export default function Connections(props) {
  const { user, isAuthenticated } = useAuth0();
  const [isSurveyMonkeyConnected, setIsSurveyMonkeyConnected] = useState(false);

  const [userToken] = useState(props.token);

  useEffect(() => {
    // check to see if users SM account is connected.
    fetch(
      SERVER_URL + "/user/" + extractAuth0UserID(user.sub) + "/sm-connected",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.sm_connected) {
          setIsSurveyMonkeyConnected(true);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error checking SM connection status.");
      });
  }, [userToken, user.sub]);

  const disconnectSurveyMonkeyHandler = () => {
    console.log("disconnect");
  };

  const connectSurveyMonkeyHandler = () => {
    // let state = v4();
    let { REACT_APP_OAUTH_REDIRECT_URI, REACT_APP_SM_CLIENT_ID } = process.env;
    let smOAuthRedirectURI =
      SM_API_BASE +
      "/oauth/authorize?response_type=code&redirect_uri=" +
      encodeURIComponent(REACT_APP_OAUTH_REDIRECT_URI) +
      "&client_id=" +
      REACT_APP_SM_CLIENT_ID;
    // "&state=" +
    // encodeURIComponent(state);
    // redirect user to SM OAuth screen for our app.
    window.location.assign(smOAuthRedirectURI);
  };

  return (
    isAuthenticated && (
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Header>Connections</Card.Header>
              <Card.Body>
                <Table>
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SurveyMonkey</td>
                      <td>
                        {isSurveyMonkeyConnected
                          ? "Connected"
                          : "Not Connected"}
                      </td>
                      <td>
                        {isSurveyMonkeyConnected ? (
                          <Button
                            variant="danger"
                            onClick={disconnectSurveyMonkeyHandler}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={connectSurveyMonkeyHandler}
                          >
                            Connect
                          </Button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  );
}
