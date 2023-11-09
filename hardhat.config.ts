import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const { DEPLOYER_PRIVATE_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    // other networks...
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  }
};

export default config;
