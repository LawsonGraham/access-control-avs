// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";
import {IWhitelistAvs} from "../src/interfaces/IWhitelistAvs.sol";
import {IAttestationCenter} from "../lib/othentic-contracts/src/NetworkManagement/L2/interfaces/IAttestationCenter.sol";

contract CounterScript is Script {
    Counter public counter;

    address public owner = 0x8b35465EC613E50B3629Cb38fED26bEC7765da32;

    address public counterAddress = 0x5a956FB687Fb660550A75260078be19a5B463EB9;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        counter = new Counter(owner, 0);

        vm.stopBroadcast();
    }

    function setWhitelistMethod() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        counter = Counter(counterAddress);

        string[] memory params = new string[](1);
        params[0] = "<UA>";

        string[] memory requirement = new string[](2);
        requirement[0] = "GT";
        requirement[1] = "100000000";

        IWhitelistAvs.WhitelistMethod memory method = IWhitelistAvs.WhitelistMethod({
            chainId: "sepolia",
            contractAddress: 0xaCB4CBd72244753cE534e333EE07C0214cD0E54D,
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
        console.log("Whitelist methods retrieved");
        for (uint256 i = 0; i < method.length; i++) {
            console.log(method[i].chainId);
            console.log(method[i].contractAddress);
            console.log(method[i].method);
            console.log(method[i].params[0]);

            console.log(method[i].requirement.length);
            console.log(method[i].requirement[0]);
            console.log(method[i].requirement[1]);
        }
        console.log(method.length);
        vm.stopBroadcast();
    }

    function readWhitelist() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        counter = Counter(counterAddress);

        address addressToCheck = 0x9bB9B1bcE338D35120E904c7b38a72f1169332Ee;
        
        bool whitelisted = counter.whitelist(addressToCheck);
        console.log("Whitelist retrieved");
        console.log(whitelisted);
        vm.stopBroadcast();
    }

    // function afterTaskSubmit() public {
    //     uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    //     vm.startBroadcast(deployerPrivateKey);

    //     counter = Counter(counterAddress);

    //     IAttestationCenter.TaskInfo memory taskInfo = IAttestationCenter.TaskInfo({
    //         data: abi.encode(address(0x8b35465EC613E50B3629Cb38fED26bEC7765da32)),
    //         proofOfTask: "",
    //         taskPerformer: 0x8b35465EC613E50B3629Cb38fED26bEC7765da32,
    //         taskDefinitionId: 0
    //     });
        
    //     bool isApproved = true;

    //     bytes memory tpSignature = abi.encodePacked("tpSignature");

    //     uint256[2] memory taSignature = [uint256(1), uint256(2)];

    //     taSignature[0] = 1;
    //     taSignature[1] = 2;

    //     uint256[] memory operatorIds = new uint256[](1);

    //     counter.afterTaskSubmission(taskInfo, isApproved, tpSignature, taSignature, operatorIds);

    //     vm.stopBroadcast();
    // }
}

//hex"307838623335343635454336313345353042333632394362333866454432366245433737363564613332"