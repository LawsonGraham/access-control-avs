require('dotenv').config();
const dalService = require("./dal.service");
const queryService = require("./query.service");

async function validate(proofOfTask, data) {
  try {
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      const whitelistOptions = await queryService.getContractWhitelistMethods();


      for (var i = 0; i < whitelistOptions.length; i++) {
        whitelistOptions[i].params = whitelistOptions[i].params.map((value) => value === "<UA>" ? taskResult.userAddress.toLowerCase() : value);
      }
      
      var option = whitelistOptions[0];

      const validationMethod = whitelistOptions.find(option => option.chainId === taskResult.chainId && option.contractAddress.toLowerCase() === taskResult.contractAddress.toLowerCase() && option.method === taskResult.method && arraysEqual(option.params, taskResult.params));
      console.log('Validation Method:', validationMethod);

      if (validationMethod == undefined) {
        return false;
      }
      var result = await queryService.getValue(validationMethod.chainId, validationMethod.contractAddress.toLowerCase(), taskResult.contractABI, validationMethod.method, validationMethod.params, taskResult.userAddress);
      if (result === undefined) {
        return false;
      }
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
          if (result >= assertedValue) {
              return false;
          }
      } else if (assertionType == "GT") {
          if (result <= assertedValue) {
            console.log("NOT GT")
              return false;
          }
      } else if (assertionType == "EQ") {
          if (result !== assertedValue) {
              return false;
          }
      } else {
          return false;
      }

      // assert that the data field passed on chain is equivalent to the data field used in validation
      if (taskResult.userAddress.toLowerCase() !== data[0].toLowerCase()) {
          return false;
      };

      return true;
    } catch (err) {
      // console.error(err?.message);
      return false;
    }
  }

  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      console.log(typeof(arr1[i]), typeof(arr2[i]));
        if (typeof(arr1[i]) === "string" && typeof(arr2[i]) === "string") {
          if (arr1[i].toLowerCase() !== arr2[i].toLowerCase()) {
            console.log("STRINGS ARE NOT EQUAL");
            return false;
          }
        }
        else if (arr1[i] !== arr2[i]) {
          console.log("NON-STRINGS ARE NOT EQUAL");
          return false;
        }
    }
    return true;
}

  
  module.exports = {
    validate,
  }