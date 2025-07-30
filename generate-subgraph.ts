import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { ethers } from "ethers";
import "dotenv/config";

const abiPath = process.env.ABI_PATH as string;
const contractAddress = process.env.CONTRACT_ADDRESS as string;
const subgraphRPCProvider = process.env.SUBGRAPH_RPC_PROVIDER as string;
const subgraphIP: string = process.env.SUBGRAPH_SERVICE_IP as string;
const projectName: string = process.env.SUBGRAPH_PROJECT_NAME as string;
const subgraphPort: string = process.env.SUBGRAPH_PORT as string;
const subgraphNetwork: string = process.env.SUBGRAPH_NETWORK as string;

let blockNumber: number = process.env.SUBGRAPH_START_BLOCK_NUMBER as unknown as number;
let networksFilePath: string;
let subgraphFilePath: string;

// Function to get the address and block number
async function initialize() {
  if (!subgraphRPCProvider) {
    throw new Error("Please set the SUBGRAPH_RPC_PROVIDER environment variable.");
  }
  const provider = new ethers.JsonRpcProvider(subgraphRPCProvider);
  if (!subgraphIP) {
    throw new Error("Please set the SUBGRAPH_SERVICE_IP environment variable.");
  }
  if (!projectName) {
    throw new Error("Please set the SUBGRAPH_PROJECT_NAME environment variable.");
  }
  if (!blockNumber) {
    blockNumber = await provider.getBlockNumber();
  }

  networksFilePath = path.join(__dirname, `./subgraph/${projectName}/networks.json`);
  subgraphFilePath = path.join(__dirname, `./subgraph/${projectName}/subgraph.yaml`);

  console.log("projectName", projectName);
  console.log("contractAddress", contractAddress);
  console.log("blockNumber", blockNumber);
  console.log("networksFilePath", networksFilePath);
  console.log("subgraphFilePath", subgraphFilePath);

  const projectPath = path.join(__dirname, `./subgraph/${projectName}`);
  if (fs.existsSync(projectPath)) {
    console.log(`Directory ${projectPath} exist.`);
    fs.rmSync(projectPath, { recursive: true, force: true });
    console.log(`Directory ${projectPath} has been deleted.`);
  }
}

// Function to run the graph init command
async function runGraphInit() {
  const command = `
    graph init \
    --skip-git \
    --protocol ethereum \
    --from-contract 0x936657D0FD1b3aa305EB0cd71830dF16A010A08e \
    --network base-sepolia \
    --abi ${abiPath} \
    --start-block=13067270 \
    --contract-name=${projectName} \
    --index-events \
    ${projectName} subgraph/${projectName}
  `;

  await execCommand(command);
}

// Add a new value to networks.json
function updateNetworksJson(address: string, blockNumber: number) {
  console.log("update networks.json at", networksFilePath);
  const networksData = JSON.parse(fs.readFileSync(networksFilePath, "utf-8"));

  // Add a new network entry
  networksData[subgraphNetwork] = {
    AssetMetadata: {
      address: address,
      startBlock: blockNumber,
    },
  };

  // Write the updated data back to the file
  fs.writeFileSync(networksFilePath, JSON.stringify(networksData, null, 2));
  console.log("Updated networks.json successfully.");
}

// Modify a value in subgraph.yaml
function updateSubgraphYaml(address: string, blockNumber: number) {
  console.log(`update subgraph.yaml at`, subgraphFilePath);
  const subgraphData = fs.readFileSync(subgraphFilePath, "utf-8");
  const updatedSubgraphData = subgraphData
    .replace("network: base-sepolia", `network: ${subgraphNetwork}`)
    .replace("startBlock: 13067270", `startBlock: ${blockNumber}`)
    .replace('address: "0x936657D0FD1b3aa305EB0cd71830dF16A010A08e"', `address: "${address}"`)
    .replace("specVersion: 1.3.0", `specVersion: 1.0.0`);

  // Write the updated data back to the file
  fs.writeFileSync(subgraphFilePath, updatedSubgraphData);
  console.log("Updated subgraph.yaml successfully.");
}

async function buildAndDeploySubgraph() {
  let command;
  
  command = `cd subgraph/${projectName} && graph codegen`;
  console.log(`execute command: ${command}`);
  await execCommand(command);
  console.log(`execute command: ${command} finished`);
  
  command = `cd subgraph/${projectName} && graph build`;
  console.log(`execute command: ${command}`);
  await execCommand(command);
  console.log(`execute command: ${command} finished`);


  command = `cd subgraph/${projectName} && graph create --node http://${subgraphIP}:${subgraphPort}/ ${projectName}`;
  console.log(`execute command: ${command}`);
  await execCommand(command);
  console.log(`execute command: ${command} finished`);


  command = `cd subgraph/${projectName} && graph deploy --node http://${subgraphIP}:${subgraphPort}/ --ipfs http://${subgraphIP}:15001 ${projectName} -l v0.0.1`;
  console.log(`execute command: ${command}`);
  await execCommand(command);
  console.log(`execute command: ${command} finished`);

}

function execCommand(command: string) {
  try {
    const output = execSync(command, { encoding: "utf-8" });
    console.log(output);
  } catch (error) {
    console.error(`Error: ${error}, Command: ${command}, pwd: ${execSync("pwd")}`);
  }
}

// Main function to execute the updates
async function main() {
  await initialize();

  await runGraphInit();
  console.log("graph init done");

  // @ts-ignore
  updateNetworksJson(contractAddress, blockNumber);
  console.log("update networks.json done");

  // @ts-ignore
  updateSubgraphYaml(contractAddress, blockNumber);
  console.log("update subgraph.yaml done");

  await buildAndDeploySubgraph();
}

main().then(() => {
  console.log("Subgraph create and deploy successfully.");
});
