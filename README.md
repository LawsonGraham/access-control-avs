# AuthStream: Dynamic Access Control Framework

AuthStream is an open-source dynamic access control framework built using Othentic's AVS framework. It is intended as a development tool to simplify the implementation of complex and nuanced access control for protocols, maintaining trustlessness and verifiability.

## Using our framework

Exposing the simplest interface as possible for the user, see `contracts/src/Counter.sol` as an example of how to integrate with AuthStream's security infrastructure. It is as simple as implementing this single interface `IWhitelistAvs` and our framework will do the rest. Here is the interface for visibility:

(INSERT IMAGE HERE)

## Demo

Here is a simple demo for a protocol like PermiSwap, a permissioned swap protocol which only lets whitelisted users swap with the coveted ToTheMoonCoin. Users can get whitelisted via having a sufficient balance of another token on sepolia in this example. For those not whitelisted, they are gated from this swap and stuck only trading Rug Coin.

(INSERT DEMO HERE)

## Instructions for Setup

### Prerequisites

- [Access to Othentic GitHub repositories & NPM](https://zvk25weryww.typeform.com/to/N7kPLNpE)
- Accounts:
  - Deployer account:
    - At least 1.5 holETH ([Faucet](https://holesky-faucet.pk910.de/))
    - At least 5 Amoy MATIC ([Faucet](https://docs.google.com/forms/d/e/1FAIpQLSe4npoGldJknEs9EBtPaV3AS-0HTso2IuMWDCiMmLEMCx8euQ/viewform))
  - Operator account x 3 (see [[Optional] Utility script for creating an account](https://www.notion.so/Optional-Utility-script-for-creating-an-account-37bfd26cce7648eea16a0637ec4861b5?pvs=21)):
    - At least 0.02 holETH on Holesky
  - ERC-20 token address
- Software:
  - Foundry
  - Node 18 installed via NVM (https://github.com/nvm-sh/nvm/blob/master/README.md)
  - Docker & docker-compose (see [Docker website](https://docs.docker.com/engine/install/) for instructions based on your OS)
  - SSH key on GitHub (https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

### Othentic CLI

At the start of the setup, update your Othentic CLI:

```bash
npm i -g @othentic/othentic-cli
```

For the deployment, set the Deployer account’s private key in the `.env` file:

### Environment File

```
PRIVATE_KEY=...
```

### Contracts Deployment

To deploy the AVS’s on-chain components, run the following command:

```bash
othentic-cli network deploy \
    --erc20 0x73967c6a0904aA032C103b4104747E88c566B1A2 \
    --l1-initial-deposit 1000000000000000000 \
    --l2-initial-deposit 2000000000000000000
```

### Operators Setup

Register 3 operators with 0.01 stETH:

```bash
othentic-cli operator register
othentic-cli operator deposit --strategy stETH --shares 0.01
```

If you don’t have the necessary funds in stETH:

```bash
othentic-cli operator deposit --strategy stETH --shares 0.01 --convert 0.012
```

### Running an AVS

#### Configuration

Print your contract addresses in a `.env` format:

```bash
othentic-cli network contracts
```

Fill in your `.env` file with the following variables:

```
OTHENTIC_REGISTRY_ADDRESS=0x41994741eD86Ec48e9578d0f64839E3F546466Fa
AVS_GOVERNANCE_ADDRESS=
ATTESTATION_CENTER_ADDRESS=

PRIVATE_KEY_PERFORMER=
PRIVATE_KEY_AGGREGATOR=
PRIVATE_KEY_ATTESTER1=
PRIVATE_KEY_ATTESTER2=
PRIVATE_KEY_ATTESTER3=

PINATA_API_KEY=7824585a98fe36414d68
PINATA_SECRET_API_KEY=41a53a837879721969e73008d91180df30dbc66097c7f75f08cd5489176b43ea
IPFS_HOST=https://othentic.mypinata.cloud/ipfs/

OTHENTIC_BOOTSTRAP_ID=12D3KooWBNFG1QjuF3UKAKvqhdXcxh9iBmj88cM5eU2EK5Pa91KB
OTHENTIC_BOOTSTRAP_SEED=97a64de0fb18532d4ce56fb35b730aedec993032b533f783b04c9175d465d9bf
```

#### Running the Network

The docker-compose configuration sets up the following:

- Aggregator node
- 3 Attester nodes
- AVS WebAPI endpoint
- TaskPerformer endpoint

Run

```bash
docker-compose build --no-cache
```

#### Executing a Task

To execute a task, send a POST request to the Task Performer service:

```bash
curl -X POST http://localhost:4003/task/execute
```

### Contract Setup

```bash
forge script script/Swap.s.sol --broadcast --rpc-url https://indulgent-polished-cloud.matic-amoy.quiknode.pro/442e133ab1add6c7acfadf6280f04bc8d2f0d65e --private-key $PRIVATE_KEY --verify --etherscan-api-key=$ETHERSCAN_API_KEY --verifier-url https://api-amoy.polygonscan.com/api/
```

Configure authentication methods with the `setWhitelistMethod` function:

```bash
forge script script/Counter.s.sol:CounterScript --sig="setWhitelistMethod()" --broadcast --rpc-url=https://rpc-amoy.polygon.technology/  --private-key $PRIVATE_KEY 
```

See the scripts folder for more methods to call

### Demo frontend setup

```bash
yarn install
yarn start
```
