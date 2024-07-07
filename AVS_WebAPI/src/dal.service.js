require('dotenv').config();
const axios = require("axios");

var ipfsHost='';

function init() {
  ipfsHost = process.env.IPFS_HOST;
}


async function getIPfsTask(cid) {
    const { data } = await axios.get(ipfsHost + cid);
    return {
      chainId: data.chainId,
      contractAddress: data.contractAddress,
      contractABI: data.contractABI,
      method: data.method,
      params: data.params,
      requirement: data.requirement,
      value: data.value,
      userAddress: data.userAddress,
    };
  }  
  
module.exports = {
  init,
  getIPfsTask
}