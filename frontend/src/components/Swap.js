import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList.json";
import axios from "axios";
import { BigNumber, ethers } from "ethers";

const whitelistContractAddress = "0x5a956FB687Fb660550A75260078be19a5B463EB9";
const whitelistContractABI = require("../whitelistContractABI.json").abi;
const swapMoonContractAddress = "0xB37Ba5fDAbdfF3938bb0A8b07063E15bE97FECef";
const swapRugContractAddress = "0xEd02C5B8fD707A657Efd396F0010a84A02505382";
const swapContractABI = require("../swapContractABI.json").abi;
const queryContractABI = require("../queryContractABI.json");

function Swap(props) {
  const { address, isConnected } = props;
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOneBalance, setTokenOneBalance] = useState(0);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(0);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if(e.target.value && prices){
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
    }else{
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.address, one.address);
  }

  function modifyToken(i){
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].address, tokenTwo.address)
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address)
    }
    setIsOpen(false);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  async function fetchPrices(one, two){

      // const res = await axios.get(`http://localhost:3001/tokenPrice`, {
      //   params: {addressOne: one, addressTwo: two}
      // })


      
      setPrices({ratio: 1})
  }

  async function executeSwap(amountIn){
    console.log('Executing swap');
    console.log('Address:', address); 

    amountIn = ethers.utils.parseUnits(amountIn, 18);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
          tokenOne.ticker === "RugCoin" ? swapRugContractAddress : swapMoonContractAddress,
          // "0xEd02C5B8fD707A657Efd396F0010a84A02505382",
          swapContractABI,
          signer
        );
       
      try {
        console.log('Amount In:', amountIn);
        const response = await contract.swap(address, amountIn, false, {
          gasLimit: 1000000,
        });
        console.log(response);

        await response.wait();

        queryBalance(tokenOne, true);
        queryBalance(tokenTwo, false);

      } catch (err) {
        console.log("ERROR", err);
      }
    }
  
  }

  async function checkWhitelist(){
    console.log('Checking whitelist');
    console.log('Address:', address); 
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        whitelistContractAddress,
        whitelistContractABI,
        signer
      );
      try {
        const response = await contract.whitelist(address);
        console.log(response);

        setIsWhitelisted(response);
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }

  async function joinWhitelist() {
    const url = 'http://localhost:4003/task/execute';
    const data = {
        "taskDefinitionId": "0",
        "chainId": "sepolia",
        "contractAddress": "0x53844f9577c2334e541aec7df7174ece5df1fcf0",
        "contractABI": queryContractABI,
        "method": "balanceOf",
        "params": ["<UA>"],
        "requirement": ["GT", 1],
        "userAddress": address
    };

    try {
        const response = await axios.post(url, data);
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            console.error('Response error data:', error.response.data);
        }
    }
}

async function queryBalance(token, isTokenOne) {
  if (token.ticker === "USDC") {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract1 = new ethers.Contract(
          swapRugContractAddress,
          swapContractABI,
          signer
        );
      const contract2 = new ethers.Contract(
          swapMoonContractAddress,
          swapContractABI,
          signer
        );
      try {
        const response = await contract1.balance2(address);
        const res2 = await contract2.balance2(address);
        console.log(response, res2);
        isTokenOne ? setTokenOneBalance(Number(ethers.utils.formatUnits(response.add(res2), 18))) : setTokenTwoBalance(Number(ethers.utils.formatUnits(response.add(res2), 18)));

      } catch (err) {
        console.log("ERROR", err);
      }
    }
  } else {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      var contract;
      if (tokenOne.ticker === "RugCoin") {
        contract = new ethers.Contract(
          swapRugContractAddress,
          swapContractABI,
          signer
        );
      } else { // Moon coin
        contract = new ethers.Contract(
          swapMoonContractAddress,
          swapContractABI,
          signer
        );
      };
      try {
        const response = await contract.balance1(address);
        console.log(response);
        isTokenOne ? setTokenOneBalance(Number(ethers.utils.formatUnits(response, 18))) : setTokenTwoBalance(Number(ethers.utils.formatUnits(response, 18)));

      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }
  
}

  useEffect(()=>{

    fetchPrices(tokenList[0].address, tokenList[1].address)
    checkWhitelist();

  }, [])

  useEffect(()=>{

    checkWhitelist();

  }, [address])

  useEffect(()=>{

    queryBalance(tokenOne, true)


  }, [tokenOne, address])

  useEffect(()=>{

    queryBalance(tokenTwo, false);


  }, [tokenTwo, address])


  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
          />
          <p className="bal1">Balance: {tokenOneBalance.toFixed(0)}</p>
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <p className="bal2">Balance: {tokenTwoBalance.toFixed(0)}</p>
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        {/* TODO: FIGURE THIS OUT */}
        <div className="swapButton" disabled={!tokenOneAmount || !isConnected} onClick={() => tokenTwo.ticker === "ToTheMoonCoin" && !isWhitelisted ? joinWhitelist() : executeSwap(tokenOneAmount)}>{tokenTwo.ticker === "ToTheMoonCoin" && !isWhitelisted ? 'Get Whitelisted' : 'Swap'}</div>
      </div>
    </>
  );
}

export default Swap;
