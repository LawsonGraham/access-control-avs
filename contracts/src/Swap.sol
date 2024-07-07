// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

contract Swap {
    mapping(address => uint256) public balance1;

    mapping(address => uint256) public balance2;

    function setBal1(address user, uint256 amount) public {
        balance1[user] = amount;
    }

    function setBal2(address user, uint256 amount) public {
        balance2[user] = amount;
    }

    function swap(address user, uint256 amountIn, bool bal1_in) public {
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
