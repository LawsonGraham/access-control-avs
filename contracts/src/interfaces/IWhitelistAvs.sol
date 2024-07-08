// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.20;

import {IAvsLogic} from "lib/othentic-contracts/src/NetworkManagement/L2/interfaces/IAvsLogic.sol";

interface IWhitelistAvs is IAvsLogic {
    struct WhitelistMethod {
        string chainId;
        address contractAddress;
        string method;
        string[] params;
        string[] requirement;
    }

    function getWhitelistMethods() external view returns (WhitelistMethod[] memory);
}