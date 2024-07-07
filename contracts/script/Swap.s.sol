// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Swap} from "../src/Swap.sol";

contract SwapScript is Script {
    Swap public swap;


    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        swap = new Swap();

        vm.stopBroadcast();
    }
}
