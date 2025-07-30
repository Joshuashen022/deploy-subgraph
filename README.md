# Deploy Subgraph

A TypeScript script to automatically generate and deploy subgraphs for Ethereum contracts.

## Features

- Automatically reads contract addresses and ABI from environment variables
- Generates subgraph configuration files
- Deploys subgraphs to a Graph Node
- Supports multiple networks and environments
- Includes Graph CLI dependencies for seamless deployment

## Prerequisites

- Node.js >= 18.0.0

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Required: RPC Provider for blockchain interaction
SUBGRAPH_RPC_PROVIDER=https://your-rpc-endpoint

# Required: Contract information
CONTRACT_ADDRESS=0xYourContractAddress
ABI_PATH=./path/to/your/contract/abi.json

# Required: Subgraph configuration
SUBGRAPH_PROJECT_NAME=your-project-name
SUBGRAPH_NETWORK=your-network-name
SUBGRAPH_SERVICE_IP=your-graph-node-ip
SUBGRAPH_PORT=8000 # by default

# Optional: Start block number (will use current block if not provided)
SUBGRAPH_START_BLOCK_NUMBER=12345678
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
├── README.md           # This file
├── .env                # Environment variables (create this)
├── abi/                # ABI files directory (excluded from git)
└── subgraph/           # Generated subgraph files (excluded from git)
```

## How it works

1. **Initialization**: Reads environment variables and validates required settings
2. **Contract Setup**: Uses provided contract address and ABI path from environment variables
3. **Graph Init**: Runs `graph init` to create the subgraph structure with the specified contract
4. **Configuration Update**: Updates `networks.json` and `subgraph.yaml` with the correct contract address and block number
5. **Build & Deploy**: Runs `graph codegen`, `graph build`, `graph create`, and `graph deploy` to deploy the subgraph

## Dependencies

The project includes:
- `ethers` - For Ethereum blockchain interactions
- `dotenv` - For environment variable management
- `@graphprotocol/graph-cli` - Graph CLI for subgraph operations
- `@graphprotocol/client-cli` - Graph client CLI
- TypeScript development dependencies

## Environment Variable Details

### Required Variables

- `SUBGRAPH_RPC_PROVIDER`: Your Ethereum RPC endpoint (e.g., Infura, Alchemy)
- `CONTRACT_ADDRESS`: The deployed contract address to index
- `ABI_PATH`: Path to the contract ABI JSON file
- `SUBGRAPH_PROJECT_NAME`: Name for your subgraph project
- `SUBGRAPH_NETWORK`: Network name (e.g., mainnet, sepolia, base-sepolia)
- `SUBGRAPH_SERVICE_IP`: IP address of your Graph Node
- `SUBGRAPH_PORT`: Port of your Graph Node (default: 8000)

### Optional Variables

- `SUBGRAPH_START_BLOCK_NUMBER`: Starting block for indexing (defaults to current block)

## Example .env file

```env
SUBGRAPH_RPC_PROVIDER=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
ABI_PATH=./abi/MyContract.json
SUBGRAPH_PROJECT_NAME=my-contract-subgraph
SUBGRAPH_NETWORK=sepolia
SUBGRAPH_SERVICE_IP=192.168.1.100
SUBGRAPH_PORT=8000
SUBGRAPH_START_BLOCK_NUMBER=12345678
```

## Troubleshooting

1. **Missing environment variables**: Ensure all required environment variables are set in your `.env` file
2. **Graph CLI not found**: The script includes Graph CLI as a dependency, so it should work without global installation
3. **Network connection issues**: Verify your RPC provider and Graph Node are accessible
4. **Contract not found**: Ensure the contract address is correct and deployed on the specified network

## License

MIT 