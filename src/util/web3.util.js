const Web3 = require("web3");
const Contract = require("@truffle/contract");
const WalletProvider = require("@truffle/hdwallet-provider");
const PRIVATE_KEY = process.env.PRIVATE_KEY

const RPC_URL = "https://avalanche-fuji.infura.io/v3/4e5cd3628a304f07aabb7f9698df804e";
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
const provider = new WalletProvider(PRIVATE_KEY, RPC_URL);

async function getContractInstance(contractAddress, abi) {
  try {
    const contract = Contract({ abi });
    contract.setProvider(provider);
    return await contract.at(contractAddress);
  } catch (err) {
    console.log(
      "Error happened when fetching contract instance",
      JSON.stringify(err.stack)
    );

    
  }
}

function getSigner(privateKey = PRIVATE_KEY) {
  try {
    return web3.eth.accounts.privateKeyToAccount(privateKey);
  } catch (err) {
    console.log(
      "Error happened when getting signer",
      JSON.stringify(err.stack)
    );
  }
}

function getSignerAddress() {
  try {
    return getSigner().address;
  } catch (err) {
    console.log(
      "Error happened when getting signer address",
      JSON.stringify(err.stack)
    );
  }
}


module.exports = {
  getContractInstance,
  getSignerAddress
};
