// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract ApeSurveyContract {
    uint256 storedData;

    event SurveyFunded(address _user, string _pool, uint256 _amount);
    event RewardPoolClosed(address _user, string _pool, uint256 _rewarded);
    event RewardPoolIncreased(
        address _user,
        string _pool,
        uint256 amount,
        uint256 _total
    );
    event RewardEarned(address _participant, address _creator, string _pool);
    event RewardsPaidOut(
        address _user,
        string _pool,
        uint256 _amount,
        uint256 _claims
    );

    struct RewardPool {
        string title;
        uint256 totalFunds;
        uint256 totalEarned;
        uint256 totalRewarded;
        bool active;
        uint256 responseReward;
        uint256 responses;
        mapping(address => uint256) participants; // maps participant address to timestamp completed.
        uint256 createdAt;
    }

    // surveyRewardPools holds a mapping of all user survey reward pools.
    mapping(address => mapping(string => RewardPool)) public surveyRewardPools;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    function getRewardPool(string memory _poolID)
        public
        view
        returns (
            string memory _title,
            uint256 _totalFunds,
            uint256 _totalEarned,
            uint256 _totalRewarded,
            bool _active,
            uint256 _responseReward,
            uint256 _responses,
            uint256 _createdAt
        )
    {
        return (
            surveyRewardPools[msg.sender][_poolID].title,
            surveyRewardPools[msg.sender][_poolID].totalFunds,
            surveyRewardPools[msg.sender][_poolID].totalEarned,
            surveyRewardPools[msg.sender][_poolID].totalRewarded,
            surveyRewardPools[msg.sender][_poolID].active,
            surveyRewardPools[msg.sender][_poolID].responseReward,
            surveyRewardPools[msg.sender][_poolID].responses,
            surveyRewardPools[msg.sender][_poolID].createdAt,

        );
    }
}
