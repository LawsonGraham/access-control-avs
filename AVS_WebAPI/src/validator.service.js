require('dotenv').config();
const dalService = require("./dal.service");
const oracleService = require("./oracle.service");

async function validate(proofOfTask) {

  try {
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      var data = await oracleService.getPrice("ETHUSDT");
      const upperBound = data.price * 1.05;
      const lowerBound = data.price * 0.95;
      let isApproved = true;

      // we have some chain -> rpc config

      // proof of task has:
      // chain id
      // everything necessary to query on chain
          // contract address & the method to query & the requirement
      // the value which was found on chain
      // MVP: the address to add to the mapping

      // validator fetches and confirms requirement

      if (taskResult.price > upperBound || taskResult.price < lowerBound) {
        isApproved = false;
      }
      return isApproved;
    } catch (err) {
      console.error(err?.message);
      return false;
    }
  }
  
  module.exports = {
    validate,
  }