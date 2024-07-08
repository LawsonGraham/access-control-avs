require('dotenv').config();
const ethers = require("ethers");

async function getValue(chainID, contractAddress, contractABI, method, params, userAddress) {
    try {
        const provider = new ethers.getDefaultProvider(chainID);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        if (params.some(param => param === "<UA>")) {
            params[params.indexOf("<UA>")] = userAddress;
        }
        // const result = await contract[method](...params);
        const result = await contract.balanceOf(...params);
        return Number(result);

    } catch (err) {
      // console.error(err)
    }
  }
  
  module.exports = {
    getValue
  }