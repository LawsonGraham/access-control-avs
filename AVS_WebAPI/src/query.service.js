require('dotenv').config();
const ethers = require("ethers");

const protocolContractAddress = "0xD1EC850713949B6684C0b5873FF0479E3a3F0D74";
const protocolContractABI = require("./utils/protocolContractABI.json").abi;

async function getValue(chainID, contractAddress, contractABI, method, params, userAddress) {
    try {
        const provider = new ethers.getDefaultProvider(chainID);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        if (params.some(param => param === "<UA>")) {
            params[params.indexOf("<UA>")] = userAddress;
        }
        console.log('contract:', contract);
        const result = await contract[method](...params);
        console.log('Function Result:', Number(result));
        return Number(result);

    } catch (err) {
      console.error(err)
    }
  }

async function getContractWhitelistMethods() {
    try {
        // TODO: which chain does our protocol live on?
        const provider = new ethers.getDefaultProvider('mainnet');

        const contract = new ethers.Contract(protocolContractAddress, protocolContractABI, provider);
        // returns [[String: chainId, address: contractAddress, String: method, Array: params, Arry: requirement]]
        const whitelistMethods = await contract.getWhitelistMethods();
        console.log('Function Result:', whitelistMethods);

        const whitlistObjects = whitelistMethods.data?.map(method => {
            return {
                chainId: method[0],
                contractAddress: method[1],
                method: method[2],
                params: method[3],
                requirement: method[4]
            }
        })
        return whitlistObjects;

    } catch (err) {
      console.error(err)
    }
  }
  
  module.exports = {
    getValue,
    getContractWhitelistMethods
  }