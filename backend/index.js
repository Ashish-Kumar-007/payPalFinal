const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://paypal-app.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    headers: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());

function convertArrayToObjects(arr) {
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(0, 4)}`,
    subject: transaction[4],
  }));

  return dataArray.reverse();
}

app.get("/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query;
  const contractAddr = "0x2bD6c5E444A78e141540bC68Ed2E92d7e8EE86f8"

  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: Moralis.EvmUtils.EvmChain.BSC_TESTNET,
    address: contractAddr,
    functionName: "getMyName",
    abi: ABI,
    params: { _user: userAddress },
  });
  // console.log(response)
  const jsonResponseName = response.raw;

  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain: Moralis.EvmUtils.EvmChain.BSC_TESTNET,
    address: userAddress,
  });

  const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2);


  let jsonResponseDollars;

  convertEthToUsd(jsonResponseBal.toString()).then((usdAmount) => {
    jsonResponseDollars = usdAmount;
    console.log(
      `${jsonResponseBal.toString()} ETH is approximately ${usdAmount} USD`
    );
  });

  const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x61",
    address: contractAddr,
    functionName: "getMyHistory",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseHistory = convertArrayToObjects(fourResponse.raw);

  const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x61",
    address: contractAddr,
    functionName: "getMyRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseRequests = fiveResponse.raw;

// console.log(jsonResponseRequests.toString())
  const jsonResponse = {
    name: jsonResponseName,
    balance: jsonResponseBal,
    dollars: jsonResponseDollars,
    history: jsonResponseHistory,
    requests: jsonResponseRequests,
  };

  return res.status(200).json(jsonResponse);
});

const { ethers } = require("ethers");

function convertArrayToObjects(arr) {
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(-4)}`,
    subject: transaction[4],
  }));
  return dataArray.reverse();
}

function convertDataToArrayOfObjects(data) {
  const keys = ['address', 'value', 'name', 'account'];
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const obj = {};
    obj[keys[i]] = data[i][0];
    result.push(obj);
  }

  return result;
}

async function getEthUsdPrice() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-rpc.publicnode.com	"
  );

  // ABI of Chainlink's AggregatorV3Interface contract
  const abi = [
    "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  ];

  const contractAddr = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
  const contract = new ethers.Contract(contractAddr, abi, provider);

  const roundData = await contract.latestRoundData();
  const ethUsdPrice = roundData.answer / 1e8; // Price is returned as an int, divide by 1e8 for 8 decimal places

  return ethUsdPrice;
}

async function convertEthToUsd(ethAmount) {
  const ethUsdPrice = await getEthUsdPrice();
  const usdAmount = ethAmount * ethUsdPrice;
  return usdAmount;
}

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
