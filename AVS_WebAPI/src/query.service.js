require('dotenv').config();
const ethers = require("ethers");

const protocolContractAddress = "0x5a956FB687Fb660550A75260078be19a5B463EB9";
const protocolContractABI = require("./utils/protocolContractABI.json").abi;

async function getValue(chainID, contractAddress, contractABI, method, params, userAddress) {
    console.log('chainID:', chainID);
    console.log('contractAddress:', contractAddress);
    console.log('method:', method);
    console.log('params:', params);
    console.log('userAddress:', userAddress);
    try {
        const provider = new ethers.getDefaultProvider(chainID);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        if (params.some(param => param === "<UA>")) {
            params[params.indexOf("<UA>")] = userAddress;
        }
        const result = await contract[method](...params);
        console.log('Function Result:', Number(result));
        return Number(result);

    } catch (err) {
      console.error(err)
      console.log(err)
    }
  }

async function getContractWhitelistMethods() {
    try {
        const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology/');

        const contract = new ethers.Contract(protocolContractAddress, protocolContractABI, provider);
        // returns [[String: chainId, address: contractAddress, String: method, Array: params, Arry: requirement]]
        const whitelistMethods = await contract.getWhitelistMethods();

        const whitlistObjects = whitelistMethods.map(method => {
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