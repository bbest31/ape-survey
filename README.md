# ApeSurvey

This repo holds the truffle project containing both the smart contracts and the react client application.

## Setup

### Truffle development

In the root directory use the following command `truffle development` to
have Truffle launch a development blockchain at localhost:8545.

While in the truffle development console use the command `migrate` to deploy the
smart contracts written in `./contracts` to the blockchain and generate the
json artifact files into the client application under `./client/src/contracts`
which holds all the information regarding the smart contracts that will enable
the react client to interact with them.

> You can also launch Ganache and then compile and migrate the contract using truffle separately.

> Use Windows Powershell with open as Administrator

1. Launch Ganache workspace
2. Run `truffle migrate` to deploy the contract to the Ganache chain, or `truffle compile` to just compile the contracts.
3. In Ganache check the Transactions section to see that the transactions have been processed.
4. (Optional) If you want to use the console to interact with the contracts use the `truffle console`