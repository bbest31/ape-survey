var ApeSurveyContract = artifacts.require("./ApeSurveyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ApeSurveyContract);
};
