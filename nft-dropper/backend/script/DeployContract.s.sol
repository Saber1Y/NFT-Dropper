// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";


contract MyTokenDeploy is Script {
    function run() external {

        vm.startBroadcast();

        MyToken token = new MyToken();

        vm.stopBroadcast();

        console2.log("MyToken deployed to:", address(token));
    }
}


