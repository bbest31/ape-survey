const ApeSurveyContract = artifacts.require("./ApeSurveyContract.sol");

const Ether = 10 * 18;

contract("ApeSurveyContract", (accounts) => {
  it("...should create a reward pool and read that information.", async () => {
    const contractInstance = await ApeSurveyContract.deployed();

    // Create a reward pool from non-owner account
    const poolId = "1";
    const poolTitle = "Title";
    const amount = 100;
    const fee = 5;
    const responseReward = 10;
    // events listeners.
    // let SurveyFundedEventListener = contractInstance.SurveyFunded();
    // let FeeRevenueEventListener = contractInstance.FeeRevenueEvent();

    await contractInstance.createRewardPool(
      poolId,
      poolTitle,
      amount,
      fee,
      responseReward,
      { from: accounts[1], value: fee + amount }
    );

    // ensure events are emitted
    // let surveyFundedContractLog = await new Promise((resolve, reject) =>
    //   SurveyFundedEventListener.get((error, log) =>
    //     error ? reject(error) : resolve(log)
    //   )
    // );
    // assert.equal(
    //   surveyFundedContractLog.length,
    //   1,
    //   "Survey Funded event not emitted"
    // );

    // let feeRevenueContractLog = await new Promise((resolve, reject) =>
    //   FeeRevenueEventListener.get((error, log) =>
    //     error ? reject(error) : resolve(log)
    //   )
    // );
    // assert.equal(
    //   feeRevenueContractLog.length,
    //   1,
    //   "Fee Revenue event not emitted"
    // );

    // // check event arguements
    // let surveyFundedEventArgs = surveyFundedContractLog[0].args;
    // let feeRevenueEventArgs = feeRevenueContractLog[0].args;

    // assert.equal(
    //   surveyFundedEventArgs._user,
    //   accounts[1],
    //   "Survey funded event _user is incorrect."
    // );
    // assert.equal(
    //   surveyFundedEventArgs._poolId,
    //   poolId,
    //   "Survey funded event _poolId is incorrect."
    // );
    // assert.equal(
    //   surveyFundedEventArgs._amount,
    //   amount,
    //   "Survey funded _amount is incorrect."
    // );

    // asser.equal(
    //   feeRevenueEventArgs._fee,
    //   fee,
    //   "Fee revenue event _fee is incorrect."
    // );
    // let time = await contractInstance.ping_time.call(accounts[1]);
    // assert.equal(feeRevenueEventArgs.time, time.toNumber(), "ping time");

    const rewardPoolBalance =
      await contractInstance.getCurrentRewardPoolBalance({ from: accounts[0] });

    assert.equal(
      rewardPoolBalance.words[0],
      amount,
      "The current reward pool balance is incorrect."
    );

    let contractBalance = await web3.eth.getBalance(contractInstance.address);

    assert.equal(
      contractBalance,
      amount + fee,
      "Contract balance is incorrect."
    );

    // Get reward pool via creator method
    let result = await contractInstance.getRewardPool(poolId, {
      from: accounts[1],
    });
    assert.equal(result[0], "Title", "The reward pool title was incorrect.");
    assert.equal(
      result[1].words[0],
      amount,
      "The reward pool fund amount was incorrect."
    );
    assert.equal(
      result[2].words[0],
      0,
      "The reward pool total rewarded was incorrect."
    );
    assert.equal(
      result[3],
      true,
      "The reward pool active state was incorrect."
    );
    assert.equal(
      result[4].words[0],
      responseReward,
      "The response reward was incorrect."
    );
    assert.equal(result[7], accounts[1], "The creator address was incorrect.");

    // Get reward pool via owner means
    result = await contractInstance.getUserRewardPool(accounts[1], poolId, {
      from: accounts[0],
    });
    assert.equal(result[0], "Title", "The reward pool title was incorrect.");
    assert.equal(
      result[1].words[0],
      amount,
      "The reward pool fund amount was incorrect."
    );
    assert.equal(
      result[2].words[0],
      0,
      "The reward pool total rewarded was incorrect."
    );
    assert.equal(
      result[3],
      true,
      "The reward pool active state was incorrect."
    );
    assert.equal(
      result[4].words[0],
      responseReward,
      "The response reward was incorrect."
    );
    assert.equal(result[7], accounts[1], "The creator address was incorrect.");
  });

  it("...should let the owner interact with the fee balance.", async () => {
    const contractInstance = await ApeSurveyContract.deployed();

    // fee balance carries over from previous unit tests.
    const startingFeeBalance = 5;
    const endingFeeBalance = 10;

    const startFeeBalance = await contractInstance.getFeeBalance({
      from: accounts[0],
    });

    assert.equal(
      startFeeBalance.words[0],
      startingFeeBalance,
      "The starting fee balance is incorrect."
    );

    await contractInstance.createRewardPool("1", "Title", 100, 5, 10, {
      from: accounts[0],
      value: 105,
    });

    const endFeeBalance = await contractInstance.getFeeBalance({
      from: accounts[0],
    });

    assert.equal(
      endFeeBalance.words[0],
      endingFeeBalance,
      "The ending fee balance is incorrect."
    );

    await contractInstance.withdrawFees({ from: accounts[0] });
    let newContractBalance = await web3.eth.getBalance(
      contractInstance.address
    );
    const finalFeeBalance = await contractInstance.getFeeBalance({
      from: accounts[0],
    });

    assert.equal(newContractBalance, 200, "The contract balance is incorrect.");
    assert.equal(
      finalFeeBalance.words[0],
      0,
      "The ending fee balance is incorrect."
    );
  });

  it("...should let the reward pool creator increase the pool funds.", async () => {
    const contractInstance = await ApeSurveyContract.deployed();
    const poolId = "1";
    const amount = 100;
    const fee = 5;

    await contractInstance.rewardPoolIncrease(amount, fee, poolId, {
      from: accounts[1],
      value: 105,
    });

    // Get reward pool via creator method
    let result = await contractInstance.getRewardPool(poolId, {
      from: accounts[1],
    });
    assert.equal(
      result[1].words[0],
      200,
      "The new reward pool fund amount was incorrect."
    );
  });

  it("...should let a participant claim a reward", async () => {
    const contractInstance = await ApeSurveyContract.deployed();
    const poolId = "1";

    let startBalance = await web3.eth.getBalance(accounts[2]);

    await contractInstance.claimReward(accounts[2], accounts[0], "1");

    let endBalance = await web3.eth.getBalance(accounts[2]);

    assert.equal(endBalance, parseInt(startBalance) + 10, "Reward payout is incorrect.");

    });

  it("...should let the reward pool creator close the reward pool.", async () => {
    const contractInstance = await ApeSurveyContract.deployed();
    const poolId = "1";

    let creatorBalance = await web3.eth.getBalance(accounts[1]);
    let participantBalance = await web3.eth.getBalance(accounts[2]);
    let participants = [accounts[2]];

    await contractInstance.closeRewardPool(accounts[1], poolId, participants);

    let endCreatorBalance = await web3.eth.getBalance(accounts[1]);
    let endParticipantBalance = await web3.eth.getBalance(accounts[2]);

    assert.equal(
      endCreatorBalance,
      parseInt(creatorBalance) + 190,
      "Creator ending balance is incorrect."
    );
    assert.equal(
      endParticipantBalance,
      parseInt(participantBalance) + 10,
      "Participant ending balance is incorrect."
    );

    // Get reward pool via creator method
    let result = await contractInstance.getRewardPool(poolId, {
      from: accounts[1],
    });
    assert.equal(
      result[3],
      false,
      "The reward pool active state was incorrect."
    );
  });

});
