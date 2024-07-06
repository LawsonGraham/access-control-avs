require('dotenv').config();
const ethers = require("ethers");

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
  
  module.exports = {
    getValue
  }