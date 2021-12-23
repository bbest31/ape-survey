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
import getWeb3 from "../../getWeb3";
import ApeSurveyContract from "../../contracts/ApeSurveyContract.json";

const Dashboard = () => {
  const [page, setPage] = useState("");
  const [userAccessToken, setUserAccessToken] = useState("");
  const [showSMConnectToast, setShowSMConnectToast] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(undefined);
  const [contract, setContract] = useState([]);
  const [connected, setConnected] = useState(false);

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

  const connectWalletHandler = async () => {
    try {
      console.log("try to connect");
      // get network provider and web3 instance
      const web3Instance = await getWeb3();
      console.log("web3 connect success");
      // Use web3 to get the user's accounts.
      const accounts = await web3Instance.eth.getAccounts();
      console.log("accounts connect success");
      // Get the contract instance
      const networkId = await web3Instance.eth.net.getId();
      const instance = new web3Instance.eth.Contract(
        ApeSurveyContract.abi,
        ApeSurveyContract.networks[networkId] &&
          ApeSurveyContract.networks[networkId].address
      );
      console.log("contract connect success");
      // Set web3, accounts, and contract to the state.
      setWeb3(web3Instance);
      setAccounts(accounts);
      setContract(instance);
      setConnected(true);

      console.log(accounts);
    } catch (error) {
      alert(
        "Failed to load web3, accounts, or contract. Check console for details"
      );
      console.error(error);
    }
  };

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
              {connected ? (
                accounts[0]
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={connectWalletHandler}
                >
                  Connect Wallet
                </Button>
              )}

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
