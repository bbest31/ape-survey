import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AUTH_API_URL, SERVER_URL } from "../../../../api/api";
import { CLIENT_ID, USER_CONNECTION } from "../../../../constants/constants";
import { extractAuth0UserID } from "../../../../utils/utils";

export default function Info(props) {
  const { user, isAuthenticated } = useAuth0();
  const [userToken] = useState(props.token);

  const changeEmailSubmit = async () => {
    fetch(SERVER_URL + "/user/" + extractAuth0UserID(user.sub), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify({
        email: user.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Success: ", data);
      })
      .catch((err) => {
        console.log(err);
        alert("Error: ", err);
      });
  };

  const changePasswordSubmit = () => {
    fetch(AUTH_API_URL + "/dbconnections/change_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        email: user.email,
        connection: USER_CONNECTION,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Success: ", data);
      })
      .catch((err) => {
        console.log(err);
        alert("Error: ", err);
      });
  };

  return (
    isAuthenticated && (
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Header>Info</Card.Header>
              <Card.Body>
                <Form
                  id="changeEmailForm"
                  className="mb-3"
                  onSubmit={changeEmailSubmit}
                >
                  <Form.Group className="mb-3" controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={user.email} readOnly />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Change
                  </Button>
                </Form>
                <Form id="changePasswordForm" onSubmit={changePasswordSubmit}>
                  <Form.Group className="mb-3" controlId="userPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value="000000000000000"
                      readOnly
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Change Password
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  );
}
