const ApeSurveyContract = artifacts.require("./ApeSurveyContract.sol");

const Ether = 10 * 18;

contract("ApeSurveyContract", (accounts) => {
  it("...should create a reward pool.", async () => {
    const contractInstance = await ApeSurveyContract.deployed();

    // Create a reward pool from non-owner account
    const poolId = "1";
    const poolTitle = "Title";
    const amount = 100;
    const fee = 5;
    const responseReward = 10;
    await contractInstance.createRewardPool(
      poolId,
      poolTitle,
      amount,
      fee,
      responseReward,
      { from: accounts[1], value: fee + amount }
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
      "The reward pool total earned was incorrect."
    );
    assert.equal(
      result[3].words[0],
      0,
      "The reward pool total rewarded was incorrect."
    );
    assert.equal(
      result[4],
      true,
      "The reward pool active state was incorrect."
    );
    assert.equal(
      result[5].words[0],
      responseReward,
      "The response reward was incorrect."
    );
    assert.equal(result[6].words[0], 0, "The response count was incorrect.");
    assert.equal(result[9], accounts[1], "The creator address was incorrect.");

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
      "The reward pool total earned was incorrect."
    );
    assert.equal(
      result[3].words[0],
      0,
      "The reward pool total rewarded was incorrect."
    );
    assert.equal(
      result[4],
      true,
      "The reward pool active state was incorrect."
    );
    assert.equal(
      result[5].words[0],
      responseReward,
      "The response reward was incorrect."
    );
    assert.equal(result[6].words[0], 0, "The response count was incorrect.");
    assert.equal(result[9], accounts[1], "The creator address was incorrect.");
  });

  it("...should let the owner get the fee balance.", async () => {
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
  });

  it("...should let the owner get the user reward pool ids.", async () => {});

  it("...should let the owner get a reward pool for any user.", async () => {});

  it("...should let the owner get the reward for any user.", async () => {});

  it("...should let the owner get the current contract balance.", async () => {});

  it("...should let the owner get the current reward pool balance.", async () => {});

  it("...should let the owner get the total rewards paid out.", async () => {});

  it("...should let the owner get the total reward pool funding.", async () => {});

  it("...should let the owner get the total number of responses.", async () => {});

  it("...should let the owner get the total reward pools funded.", async () => {});
});
