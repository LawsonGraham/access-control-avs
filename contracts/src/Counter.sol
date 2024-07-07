// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

import {IAvsLogic} from "lib/othentic-contracts/src/NetworkManagement/L2/interfaces/IAvsLogic.sol";
import {IAttestationCenter} from "lib/othentic-contracts/src/NetworkManagement/L2/interfaces/IAttestationCenter.sol";
import {IWhitelistAvs} from "./interfaces/IWhitelistAvs.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Counter is Ownable, IWhitelistAvs {
    uint256 public number;

    IWhitelistAvs.WhitelistMethod[] public whitelistMethods;

    mapping(address => bool) public whitelist;

    mapping(address => uint256) public balance1;

    mapping(address => uint256) public balance2;

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Counter: user is not whitelisted");
        _;
    }

    constructor(address owner, uint256 intialNumber) Ownable(owner) {
        number = intialNumber;
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

    function setWhitelistMethod(IWhitelistAvs.WhitelistMethod memory method) public onlyOwner {
        whitelistMethods.push(method);
    }

    function swap(address user, uint256 amountIn, bool bal1_in) public onlyWhitelisted {
        if (bal1_in) {
            require(balance1[user] >= amountIn, "Swap: insufficient balance");
            balance1[user] -= amountIn;
            balance2[user] += amountIn;
        } else {
            require(balance2[user] >= amountIn, "Swap: insufficient balance");
            balance2[user] -= amountIn;
            balance1[user] += amountIn;
        }
    }

    function swapWithFee(address user, uint256 amountIn, bool bal1_in) public {
        if (bal1_in) {
            require(balance1[user] >= amountIn, "Swap: insufficient balance");
            balance1[user] -= amountIn;
            balance2[user] += amountIn * 95 / 100;
        } else {
            require(balance2[user] >= amountIn, "Swap: insufficient balance");
            balance2[user] -= amountIn;
            balance1[user] += amountIn * 95 / 100;
        }
    }
}
