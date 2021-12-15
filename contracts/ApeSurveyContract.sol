// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

contract ApeSurveyContract is Ownable {
    using SafeMath for uint;

    constructor() payable {
    }

    // Structs
    struct RewardPool {
        bytes title;
        uint totalFunds;
        uint totalEarned;
        uint totalRewarded;
        bool active;
        uint responseReward;
        uint responses;
        address[] participants; //people who have earned but not claimed their reward.
        uint createdAt;
        uint closesAt;
        address creator;
    }

    struct Reward {
        address participant;
        address creator;
        bytes surveyID;
    }

    // State Variables
    // mapping of user addresses to survey ids.
    mapping(address => bytes[]) private userSurveyIdMap;
    // userRewardPoolMap maps users to their reward pools keyed by the SM survey id.
    mapping(address => mapping(bytes => RewardPool)) private userRewardPoolMap;
    // mapping of users to their rewards.
    mapping(address => Reward[]) private rewardMap;

    // current metrics
    uint private currentBalance;
    uint private feeBalance;

    // cummulative metrics
    uint private totalRewardsPaidOut; // total amount of wei paid to participants.
    uint private totalRewardPoolFunding; // total amount of wei to fund reward pools.
    uint private totalResponses; // total number of responses.
    uint private totalRewardPoolsFunded; // total number of reward pools funded.


    event WithdrawlMade(uint256 _amount, uint ts);

    function withdrawFees() public onlyOwner {
        require(feeBalance > 0, "Contracts funds are too low to withdraw from.");
        payable(owner()).transfer(feeBalance);

        emit WithdrawlMade(feeBalance, block.timestamp);
    } 

    // Getters
    // get the list of pool ids for a particular user.
    function getUserRewardPoolIds(address _user) public view onlyOwner returns (bytes[] memory) {
        return userSurveyIdMap[_user];
    }

    // get the reward pool for any user.
    function getUserRewardPool(address _user, bytes memory _poolId) public view onlyOwner returns(RewardPool memory) {
        return userRewardPoolMap[_user][_poolId];
    }

    // get the rewards for any user.
    function getUserRewards(address _user) public view onlyOwner returns(Reward[] memory) {
        return rewardMap[_user];
    }

    function getCurrentBalance() public view onlyOwner returns(uint) {
        return currentBalance;
    }

    function getTotalRewardsPaidOut() public view onlyOwner returns(uint) {
        return totalRewardsPaidOut;
    }

    function getTotalRewardPoolFunding() public view onlyOwner returns(uint) {
        return totalRewardPoolFunding;
    }

    function getTotalResponses() public view onlyOwner returns(uint) {
        return totalResponses;
    }

    function getTotalRewardPoolsFunded() public view onlyOwner returns(uint) {
        return totalRewardPoolsFunded;
    }

    // Events
    event SurveyFunded(address _user, bytes _pool, uint _amount);
    event RewardPoolClosed(address _user, bytes _pool, uint _rewarded);
    event RewardPoolIncreased(
        address _user,
        bytes _pool,
        uint amount,
        uint _total
    );
    event RewardEarned(address _participant, address _creator, bytes _pool);
    event RewardsPaidOut(
        address _user,
        bytes _pool,
        uint _amount,
        uint _claims
    );

    // Functions

    /**
     * createRewardPool allows a user to create a reward pool to fund a survey.
     * The function creates and saves the reward pool object, and sends the fee to the owner address.
     */
    function createRewardPool(
        string memory _id,
        string memory _title,
        uint _amount,
        uint _fee,
        uint _responseReward
    ) public payable {
        bytes memory title = bytes(_title);
        bytes memory surveyId = bytes(_id);
        require(_amount > 0, "Reward pool can't be zero.");
        require(_fee > 0, "Fee can't be zero.");
        require(_amount + _fee == msg.value, "Amount paid must equal sum of reward pool funding and service fee.");
        require(_fee * 20 == _amount, "Fee must equal 5% of the reward pool.");
        require(surveyId.length  != 0, "Survey id can't be blank.");
        require(title.length != 0, "Survey title can't be blank");
        require(_responseReward <= _amount, "Response reward can't be larger than the reward pool.");
        require(_amount % _responseReward == 0, "Reward pool amount must be divisble by the response reward.");
        
        address[] memory _participants;
        userRewardPoolMap[msg.sender][surveyId] = RewardPool(
            title,
            _amount,
            0,
            0,
            true,
            _responseReward,
            0,
            _participants,
            block.timestamp,
            block.timestamp,
            msg.sender
        );

        userSurveyIdMap[msg.sender].push(title);
        currentBalance += msg.value;
        totalRewardPoolFunding += msg.value;
        totalRewardPoolsFunded++;
        feeBalance += _fee;

        emit SurveyFunded(msg.sender,surveyId,_amount);

    }

    function getRewardPool(string memory _poolId)
        public
        view
        returns (
            string memory,
            uint,
            uint,
            uint,
            bool,
            uint,
            uint,
            uint,
            uint,
            address
        )
    {
        //TODO: assertions
        bytes memory poolId = bytes(_poolId);
        RewardPool memory pool = userRewardPoolMap[msg.sender][poolId];
        return (
            string(pool.title),
            pool.totalFunds,
            pool.totalEarned,
            pool.totalRewarded,
            pool.active,
            pool.responseReward,
            pool.responses,
            pool.createdAt,
            pool.closesAt,
            pool.creator
        );
    }

    // rewardPoolIncrease allows a user to increase the funds allocated to an existing reward pool.
    function rewardPoolIncrease(uint _amount, string memory _id)
        public
        payable
    {
        //TODO: assertions, implementation, payment
    }

    function closeRewardPool(string memory _id) public {}

    //
    function claimReward(address _creator, string memory survey) public {}

    function createReward(address _participant, address _creator, string memory _surveyID) private onlyOwner {}

    function getRewards() public view returns(Reward[] memory) {
        return rewardMap[msg.sender];
    }

    fallback() external payable {
        require(msg.sender == owner(), "Only the owner can send funds via the fallback function.");
    }

    receive() external payable {
        require(msg.sender == owner(), "Only the owner can send funds via the fallback function.");
    }
}
