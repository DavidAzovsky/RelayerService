import "solidity-docgen";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "solidity-coverage";
import { task } from "hardhat/config";
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: false,
            runs: 7500,
          },
        },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 7500,
          },
        },
      },
      { version: "0.6.0" },
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: false,
            runs: 7500,
          },
        },
      },
    ],
  },

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      // forking: {
      //   // url: "https://api.securerpc.com/v1",
      //   // blockNumber: 17465652
      // url: process.env.MAINNET_RPC_URL,
      // },
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`],
      blockGasLimit: 8000000,
    },
  },

  etherscan: {
    apiKey: "WYANGPE4QJMAXGH9PTU1S9W49WP6VHTQW6",
  },

  coverage: {
    network: "hardhat",
    outputDirectory: "coverage",
    runs: 1,
  },

  docgen: { output: "docs", pages: () => "index.md" },
};
