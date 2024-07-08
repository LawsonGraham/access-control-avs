// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Swap} from "../src/Swap.sol";

contract SwapScript is Script {
    Swap public swapContract;

    address swapAddress = 0xEd02C5B8fD707A657Efd396F0010a84A02505382;
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        swapContract = new Swap();

        vm.stopBroadcast();
    }

    function swap() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        swapContract = Swap(swapAddress);
        console.log("Swap contract address: ", 0x8b35465EC613E50B3629Cb38fED26bEC7765da32);
        console.log(swapContract.balance1(0x8b35465EC613E50B3629Cb38fED26bEC7765da32));

        swapContract.swap(0x8b35465EC613E50B3629Cb38fED26bEC7765da32, 100000, true);

        console.log("Completed swap");

        vm.stopBroadcast();
    }
}
