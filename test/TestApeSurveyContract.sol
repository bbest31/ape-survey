pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ApeSurveyContract.sol";

contract TestApeSurveyContract {

  function testSomething() public {
    ApeSurveyContract apeSurveyContract = ApeSurveyContract(DeployedAddresses.ApeSurveyContract());

    // simpleStorage.set(89);

    // uint expected = 89;

    // Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
  }

}
