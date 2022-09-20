require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  etherscan: {
    apiKey: process.env.EtherscanApiKey,
  },
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
