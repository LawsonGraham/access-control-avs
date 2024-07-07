// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

import {IAvsLogic} from "../../.othentic/contracts/src/NetworkManagement/L2/interfaces/IAvsLogic.sol";
import {IAttestationCenter} from "../../.othentic/contracts/src/NetworkManagement/L2/interfaces/IAttestationCenter.sol";
import {IWhitelistAvs} from "./interfaces/IWhitelistAvs.sol";

contract Counter {
    uint256 public number;

    IWhitelistAvs.WhitelistMethod[] public whitelistMethods;

    mapping(address => bool) public whitelist;

    modifier onlyWhitelisted(address userAddress) {
        require(whitelist[userAddress], "Counter: user is not whitelisted");
        _;
    }

    function afterTaskSubmission(IAttestationCenter.TaskInfo calldata _taskInfo, bool _isApproved, bytes calldata _tpSignature, uint256[2] calldata _taSignature, uint256[] calldata _operatorIds) external {
        address userAddress = abi.decode(_taskInfo.data, (address));
        if (_isApproved) {
            whitelist[userAddress] = true;
        }
    }

    function beforeTaskSubmission(IAttestationCenter.TaskInfo calldata _taskInfo, bool _isApproved, bytes calldata _tpSignature, uint256[2] calldata _taSignature, uint256[] calldata _operatorIds) external {
        // do nothing
    }

    function getWhitelistMethods() public view override returns (IWhitelistAvs.WhitelistMethod[] memory) {
        return whitelistMethods;
    }

    function setWhitelistMethod(WhitelistMethod memory method) public onlyOwner {
        // TODO: security checks
        // do nothing
        whitelistMethods.push(method);
    }       

    function setNumber(uint256 newNumber) public onlyWhitelisted {
        number = newNumber;
    }

    function increment() public onlyWhitelisted {
        number++;
    }
}
