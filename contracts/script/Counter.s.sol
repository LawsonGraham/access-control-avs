// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";
import {IWhitelistAvs} from "../src/interfaces/IWhitelistAvs.sol";

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

        counter = Counter(counterAddress);

        string[] memory params = new string[](1);
        params[0] = "<UA>";

        string[] memory requirement = new string[](2);
        requirement[0] = "GT";
        requirement[1] = "100000000";

        IWhitelistAvs.WhitelistMethod memory method = IWhitelistAvs.WhitelistMethod({
            chainId: "sepolia",
            contractAddress: 0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0,
            method: "balanceOf",
            params: params,
            requirement: requirement
        });
        
        counter.setWhitelistMethod(method);
        console.log("Whitelist method set");
        vm.stopBroadcast();
    }

    function getWhitelistMethods() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        counter = Counter(counterAddress);
        
        IWhitelistAvs.WhitelistMethod[] memory method = counter.getWhitelistMethods();
        // console.log(method[0].contractAddress);
        console.log("Whitelist methods retrieved");
        console.log(method.length);
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
