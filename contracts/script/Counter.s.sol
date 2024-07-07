// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    Counter public counter;

    address public owner = 0x8b35465EC613E50B3629Cb38fED26bEC7765da32;

    address public counterAddress = 0xD1EC850713949B6684C0b5873FF0479E3a3F0D74;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        counter = new Counter(owner, 0);

        vm.stopBroadcast();
    }

    function setWhitelistMethod() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        counter = Counter(0x8b35465EC613E50B3629Cb38fED26bEC7765da32);

        IWhitelistAvs.WhitelistMethod memory method = IWhitelistAvs.WhitelistMethod({
            chainId: "sepolia",
            contractAddress: 0x53844f9577c2334e541aec7df7174ece5df1fcf0,
            method: "balanceOf",
            params: ["<UA>"],
            requirement: ["GT", "100000000"]
        });
        
        counter.setWhitelistMethod(method);
        console.log("Whitelist method set");
        vm.stopBroadcast();
    }

    function getWhitelistMethods() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        counter = Counter(0x8b35465EC613E50B3629Cb38fED26bEC7765da32);
        
        IWhitelistAvs.WhitelistMethod[] memory method = counter.getWhitelistMethods();
        console.log(method[0]);
        vm.stopBroadcast();
    }

    function setNumber(uint256 newNumber) internal {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        counter.setNumber(newNumber);
        console.log("Counter number set to:", newNumber);
    }

    function increment() internal {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        counter.increment();
        console.log("Counter incremented");
    }
}
