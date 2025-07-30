# Deploy Subgraph

A TypeScript script to automatically generate and deploy subgraphs for Ethereum contracts.

## Features

- Automatically reads contract addresses and ABI from Ignition deployment artifacts
- Generates subgraph configuration files
- Deploys subgraphs to a Graph Node
- Supports multiple networks and environments

## Prerequisites

- Node.js >= 18.0.0
- Graph CLI installed globally: `npm install -g @graphprotocol/graph-cli`

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
SUBGRAPH_RPC_PROVIDER=https://your-rpc-endpoint
SUBGRAPH_SERVICE_IP=your-graph-node-ip
SUBGRAPH_PROJECT_NAME=your-project-name
SUBGRAPH_PORT=8000
SUBGRAPH_NETWORK=your-network-name
SUBGRAPH_START_BLOCK_NUMBER=optional-start-block
```

## Usage

Run the script:

```bash
npm start
```

Or in development mode with file watching:

```bash
npm run dev
```

## Scripts

- `npm start` - Run the subgraph generation and deployment script
- `npm run dev` - Run in development mode with file watching
- `npm run build` - Build the TypeScript project

## Project Structure

```
deploy-subgraph/
├── generate-subgraph.ts    # Main script
├── package.json           # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .gitignore           # Git ignore rules
└── README.md           # This file
```

## How it works

1. **Initialization**: Reads environment variables and connects to the RPC provider
2. **Contract Detection**: Automatically finds the deployed contract address and ABI from Ignition artifacts
3. **Graph Init**: Runs `graph init` to create the subgraph structure
4. **Configuration Update**: Updates `networks.json` and `subgraph.yaml` with the correct contract address and block number
5. **Build & Deploy**: Runs `graph codegen`, `graph build`, and `graph deploy` to deploy the subgraph

## Requirements

The script expects Ignition deployment artifacts in the following structure:
```
./ignition/deployments/chain-{chainId}/
├── artifacts/
│   └── DeployDSPRewardMode#DSPReward.json
└── deployed_addresses.json
```

## License

MIT 