// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Remix IDE import statements
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/math/SafeMath.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

// Standard import statements
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ApeSurveyContract is Ownable {
    using SafeMath for uint256;

    constructor() payable {}

    // Structs
    struct RewardPool {
        bytes title;
        uint256 totalFunds;
        uint256 totalEarned;
        uint256 totalRewarded;
        bool active;
        uint256 responseReward;
        uint256 responses;
        address[] participants; //people who have earned but not claimed their reward.
        uint256 createdAt;
        uint256 closesAt;
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
    uint256 private currentContractBalance;
    uint256 private currentRewardPoolBalance;
    uint256 private feeBalance;

    // cummulative metrics
    uint256 private totalRewardsPaidOut; // total amount of wei paid to participants.
    uint256 private totalRewardPoolFunding; // total amount of wei to fund reward pools.
    uint256 private totalResponses; // total number of responses.
    uint256 private totalRewardPoolsFunded; // total number of reward pools funded.

    event WithdrawlMade(uint256 _amount, uint256 ts);

    // withdrawFees allows the contract owner to withdraw the service fee balance made.
    function withdrawFees() public onlyOwner {
        require(
            feeBalance > 0,
            "Contracts funds are too low to withdraw from."
        );
        payable(owner()).transfer(feeBalance);

        emit WithdrawlMade(feeBalance, block.timestamp);
        feeBalance = 0;
    }

    // getFeeBalance returns the current balance of service fees accrued.
    function getFeeBalance() public view onlyOwner returns (uint256) {
        return feeBalance;
    }

    // Getters
    // get the list of survey pool ids for a particular user.
    function getUserRewardPoolIds(address _user)
        public
        view
        onlyOwner
        returns (bytes[] memory)
    {
        return userSurveyIdMap[_user];
    }

    // getRewardPoolIds gets the list of reward pool id's created by the sender.
    function getRewardPoolIds() public view returns (bytes[] memory) {
        return userSurveyIdMap[msg.sender];
    }

    // get the reward pool for any user.
    function getUserRewardPool(address _user, string memory _poolId)
        public
        view
        onlyOwner
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            bool,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        RewardPool memory pool = userRewardPoolMap[_user][bytes(_poolId)];
        address zeroAddress;
        require(pool.creator != zeroAddress, "The reward pool does not exist.");
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

    // get the rewards for any user.
    function getUserRewards(address _user)
        public
        view
        onlyOwner
        returns (Reward[] memory)
    {
        return rewardMap[_user];
    }

    function getCurrentContractBalance()
        public
        view
        onlyOwner
        returns (uint256)
    {
        return currentContractBalance;
    }

    function getCurrentRewardPoolBalance()
        public
        view
        onlyOwner
        returns (uint256)
    {
        return currentRewardPoolBalance;
    }

    function getTotalRewardsPaidOut() public view onlyOwner returns (uint256) {
        return totalRewardsPaidOut;
    }

    function getTotalRewardPoolFunding()
        public
        view
        onlyOwner
        returns (uint256)
    {
        return totalRewardPoolFunding;
    }

    function getTotalResponses() public view onlyOwner returns (uint256) {
        return totalResponses;
    }

    function getTotalRewardPoolsFunded()
        public
        view
        onlyOwner
        returns (uint256)
    {
        return totalRewardPoolsFunded;
    }

    // Events
    event SurveyFunded(address _user, string _poolId, uint256 _amount);
    event RewardPoolClosed(address _user, string _poolId, uint256 _rewarded);
    event RewardPoolIncreased(
        address _user,
        string _poolId,
        uint256 amount,
        uint256 _newTotal
    );
    event RewardEarned(address _participant, address _creator, string _poolId);
    event RewardsPaidOut(address _participant, string _poolId, uint256 _amount);
    event RewardFundsReturned(address _user, string _poolId, uint256 _amount);
    event FeeRevenueEvent(uint256 _fee, uint256 ts);

    // Functions

    /**
     * createRewardPool allows a user to create a reward pool to fund a survey.
     * The function creates and saves the reward pool object, and sends the fee to the owner address.
     */
    function createRewardPool(
        string memory _id,
        string memory _title,
        uint256 _amount,
        uint256 _fee,
        uint256 _responseReward
    ) public payable {
        bytes memory title = bytes(_title);
        bytes memory poolId = bytes(_id);
        require(_amount > 0, "Reward pool can't be zero.");
        require(_fee > 0, "Fee can't be zero.");
        require(
            _amount + _fee == msg.value,
            "Amount paid must equal sum of reward pool funding and service fee."
        );
        require(_fee * 20 == _amount, "Fee must equal 5% of the reward pool.");
        require(poolId.length != 0, "Survey id can't be blank.");
        require(title.length != 0, "Survey title can't be blank");
        require(
            _responseReward <= _amount,
            "Response reward can't be larger than the reward pool."
        );
        require(
            _amount % _responseReward == 0,
            "Reward pool amount must be divisble by the response reward."
        );

        // reward pool with that id should not already exist.
        RewardPool memory pool = userRewardPoolMap[msg.sender][poolId];
        address zeroAddress;
        require(
            pool.creator == zeroAddress,
            "Reward pool with the provided id already exists."
        );

        address[] memory _participants;
        userRewardPoolMap[msg.sender][poolId] = RewardPool(
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
        currentContractBalance += msg.value;
        currentRewardPoolBalance += _amount;
        totalRewardPoolFunding += _amount;
        totalRewardPoolsFunded++;
        feeBalance += _fee;

        emit SurveyFunded(msg.sender, string(poolId), _amount);
        emit FeeRevenueEvent(_fee, block.timestamp);
    }

    // getRewardPool allows someone to get a specific reward pool they have created.
    function getRewardPool(string memory _poolId)
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            bool,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        bytes memory poolId = bytes(_poolId);
        RewardPool memory pool = userRewardPoolMap[msg.sender][poolId];
        address zeroAddress;
        require(pool.creator != zeroAddress, "The reward pool does not exist.");
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

    // rewardPoolIncrease allows a reward pool creator to increase the funds allocated to an existing reward pool.
    function rewardPoolIncrease(
        uint256 _amount,
        uint256 _fee,
        string memory _poolId
    ) public payable {
        require(
            _amount > 0,
            "Survey reward pool increase must be more than zero."
        );
        require(_fee > 0, "Fee can't be zero.");
        require(
            _amount + _fee == msg.value,
            "Amount paid must equal sum of reward pool funding and service fee."
        );
        require(_fee * 20 == _amount, "Fee must equal 5% of the amount paid.");

        RewardPool memory rewardPool = userRewardPoolMap[msg.sender][
            bytes(_poolId)
        ];
        // check that the reward pool exists.
        address zeroAddress;
        require(
            rewardPool.creator != zeroAddress,
            "The reward pool does not exist."
        );
        require(
            rewardPool.active == true,
            "The reward pool must be active to increase the funds."
        );
        rewardPool.totalFunds += _amount;
        userRewardPoolMap[msg.sender][bytes(_poolId)] = rewardPool;
        feeBalance += _fee;
        totalRewardPoolFunding += _amount;
        currentContractBalance += msg.value;
        currentRewardPoolBalance += _amount;

        emit RewardPoolIncreased(
            msg.sender,
            _poolId,
            _amount,
            rewardPool.totalFunds
        );
        emit FeeRevenueEvent(_fee, block.timestamp);
    }

    // closeRewardPool triggers the event in where all earned funds are sent to the participant addresses,
    // the unearned balance on the reward pool is returned to the creator, the and reward pool is set as inactive.
    function closeRewardPool(
        address payable _user,
        string memory _poolId,
        address[] memory participants
    ) public onlyOwner {
        address zeroAddress;
        require(_user != zeroAddress, "Must provide a valid user address.");
        RewardPool memory pool = userRewardPoolMap[_user][bytes(_poolId)];
        require(
            pool.creator != zeroAddress,
            "The referenced survey reward pool does not exist."
        );
        require(
            pool.active == true || pool.closesAt < block.timestamp,
            "The referenced survey reward pool is already closed."
        );

        uint256 totalPayout = pool.responseReward * participants.length;
        uint256 totalReturn = pool.totalFunds - totalPayout;

        totalRewardsPaidOut += totalPayout;
        totalResponses += participants.length;
        currentContractBalance -= pool.totalFunds;
        currentRewardPoolBalance -= pool.totalFunds;

        // return unearned pool funds to creator
        payable(_user).transfer(totalReturn);

        // for each address in participants pay them the response reward
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            payable(participant).transfer(pool.responseReward);

            emit RewardsPaidOut(participant, _poolId, pool.responseReward);
        }

        pool.active = false;

        emit RewardPoolClosed(_user, _poolId, participants.length);
        emit RewardFundsReturned(_user, _poolId, totalReturn);
    }

    function getRewards() public view returns (Reward[] memory) {
        return rewardMap[msg.sender];
    }

    fallback() external payable {
        require(
            msg.sender == owner(),
            "Only the owner can send funds via the fallback function."
        );
    }

    receive() external payable {
        require(
            msg.sender == owner(),
            "Only the owner can send funds via the fallback function."
        );
    }
}
