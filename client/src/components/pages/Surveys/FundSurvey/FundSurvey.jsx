import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  DropdownButton,
  Dropdown,
  CloseButton,
} from "react-bootstrap";
import { SERVER_URL } from "../../../../api/api";
import { extractAuth0UserID } from "../../../../utils/utils";
import getWeb3 from "../../../../getWeb3";
import ApeSurveyContract from "../../../../contracts/ApeSurveyContract.json";

export default function FundSurvey(props) {
  const { user } = useAuth0();
  const [surveys, setSurveys] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [currency, setCurrency] = useState("USDC");
  const [rewardPoolAmount, setRewardPoolAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [userToken] = useState(props.token);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);

  const connectWalletHandler = async () => {
    try {
      // Get network provider and web3 instance.
      const web3Instance = await getWeb3();

      // Use web3 to get the user's accounts.
      const userAccounts = await web3Instance.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = ApeSurveyContract.networks[networkId];
      const instance = new web3Instance.eth.Contract(
        ApeSurveyContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb3(web3Instance);
      setAccounts(userAccounts);
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const fundSurveyRewardPool = async () => {
    // 1. reference your contract instance

    // 2. Call the contract
    await contract.methods.set(5).send({ from: accounts[0] });

    // 3. Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // 4. Update state with the result.
  };

  useEffect(() => {
    // get user SM surveys
    fetch(SERVER_URL + "/user/" + extractAuth0UserID(user.sub) + "/surveys", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setSurveys(data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error getting user surveys.");
      });
  }, [userToken, user.sub]);

  const onSurveyChangeHandler = (e) => {
    let value = e.target.value;

    if (value === "") {
      setSurveyQuestions([]);
    } else {
      fetch(
        SERVER_URL +
          "/user/" +
          extractAuth0UserID(user.sub) +
          "/survey/" +
          value +
          "/details",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            setSurveyQuestions(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Error getting survey questions.");
        });
    }
  };

  return (
    <div>
      <CloseButton
        aria-label="Back"
        onClick={() => {
          props.onViewChange("list");
        }}
      />
      <h3>Fund a Survey</h3>
      <Form>
        <Form.Group
          className="mb-3"
          controlId="fundSurveyForm.ControlSelectSurvey"
        >
          <Form.Label>Select survey</Form.Label>
          <Form.Select
            onChange={onSurveyChangeHandler}
            aria-label="Select survey..."
          >
            <option key={-1} value="">
              Choose...
            </option>
            {surveys.map((survey, index) => (
              <option key={index} value={survey.id}>
                {survey.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="fundSurveyForm.ControlSelectSurveyQuestion"
        >
          <Form.Label>
            Select recipient wallet address capture question
          </Form.Label>
          <Form.Select
            aria-label="Select question..."
            disabled={surveyQuestions.length > 0 ? false : true}
          >
            {surveyQuestions.map((question, index) => (
              <option key={question.position} value={question.id}>
                {question.headings[0].heading}
              </option>
            ))}
          </Form.Select>
          <Form.Text id="questionSelectHelp" muted>
            Please indicate the question that captures the recipients wallet
            address so ApeSurvey can add their address to the address payout
            list.
          </Form.Text>
        </Form.Group>

        <Row>
          <Col xs="auto">
            <Form.Group
              className="mb-3"
              controlId="fundSurveyForm.RewardPoolAmount"
            >
              <Form.Label>Reward pool amount</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  {currency === "BNB" ? "BNB" : "$"}
                </InputGroup.Text>

                <Form.Control
                  type="number"
                  placeholder="0.00"
                  onChange={(e) => {
                    setRewardPoolAmount(e.target.value);
                  }}
                />
                <DropdownButton variant="primary" title={currency} align="end">
                  <Dropdown.Item
                    onClick={() => {
                      setCurrency("BNB");
                    }}
                  >
                    BNB
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setCurrency("USDC");
                    }}
                  >
                    USDC
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Form.Group
              className="mb-3"
              controlId="fundSurveyForm.RewardAmount"
            >
              <Form.Label>Reward amount</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  {currency === "BNB" ? "BNB" : "$"}
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  onChange={(e) => {
                    setRewardAmount(e.target.value);
                  }}
                />
                <Form.Text id="rewardAmountHelp" muted>
                  {rewardAmount !== 0 ? rewardPoolAmount / rewardAmount : 0}{" "}
                  responses total
                </Form.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col></Col>
        </Row>

        {/* If the user has connected their wallet then show the rest of the form, else show connect wallet button */}
        {web3 && accounts ? (
          <Button variant="warning" onClick={fundSurveyRewardPool}>
            Fund Survey
          </Button>
        ) : (
          <Button variant="warning" size="lg" onClick={connectWalletHandler}>
            Connect Wallet
          </Button>
        )}
      </Form>
    </div>
  );
}
