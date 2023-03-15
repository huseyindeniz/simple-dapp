import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  paths: {
    artifacts: "../client/src/blockchain/artifacts",
  },
  typechain: {
    outDir: "../client/src/blockchain/types",
    target: "ethers-v5",
  },
  networks: {
    hardhat: {},
    ganache: {
      url: "http://localhost:7545",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    token: "AVAX",
    //coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};

export default config;
