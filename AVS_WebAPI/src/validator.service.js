require('dotenv').config();
const dalService = require("./dal.service");
const queryService = require("./query.service");

async function validate(proofOfTask, data) {
  console.log('data: ', data);
  try {
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      console.log(taskResult);
      const whitelistOptions = await queryService.getContractWhitelistMethods();
      console.log('whitelistOptions:', whitelistOptions);

      const validationMethod = whitelistOptions.find(option => option.chainId === taskResult.chainId && option.contractAddress === taskResult.contractAddress && option.method === taskResult.method && option.params === taskResult.params);
      console.log('Validation Method:', validationMethod);

      if (validationMethod == undefined) {
        return false;
      }

      var result = await queryService.getValue(chainId, taskResult.contractAddress, taskResult.ABI, taskResult.method, taskResult.params, taskResult.userAddress);

      console.log('Task Result:', taskResult);
      // we have some chain -> rpc config

      // proof of task has:
      // chain id
      // everything necessary to query on chain
          // contract address & the method to query & the requirement
      // the value which was found on chain
      // MVP: the address to add to the mapping

      // validator fetches and confirms requirement

      const assertionType = validationMethod.requirement[0];
      const assertedValue = validationMethod.requirement[1];

      if (assertionType == "LT") {
          if (result.value.toString() >= assertedValue) {
              return false;
          }
      } else if (assertionType == "GT") {
          if (result.value.toString() <= assertedValue) {
              return false;
          }
      } else if (assertionType == "EQ") {
          if (result.value.toString() !== assertedValue) {
              return false;
          }
      } else {
          return false;
      }

      // assert that the data field passed on chain is equivalent to the data field used in validation
      if (taskResult.userAddress !== data) {
          return false;
      };

      return true;
    } catch (err) {
      console.error(err?.message);
      return false;
    }
  }
  
  module.exports = {
    validate,
  }