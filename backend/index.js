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
  const contractAddr = "0xB45C70ca7f00Aa4c1dE8e9Ba4FBf285105b54Bba"

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

  // const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
  //   address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  // });

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

// app.get("/getNameAndBalance", async (req, res) => {
//   const { userAddress } = req.query;
//   const contractAddr = "0xC5026d20C2Aa8cA173b2F8576E5D01aBa17b4752";

//   const provider = new ethers.providers.JsonRpcProvider(
//     "https://1rpc.io/holesky"
//   );

//   const contract = new ethers.Contract(contractAddr, ABI, provider);

//   const responseName = await contract.getMyName(userAddress);

//   const balance = await provider.getBalance(userAddress);

//   const jsonResponseBal = ethers.utils.formatEther(balance);

//   console.log(jsonResponseBal.toString());

//   let jsonResponseDollars;

//   convertEthToUsd(jsonResponseBal.toString()).then((usdAmount) => {
//     jsonResponseDollars = usdAmount;
//     console.log(
//       `${jsonResponseBal.toString()} ETH is approximately ${usdAmount} USD`
//     );
//   });

//   const jsonResponseHistory = await contract.getMyHistory(userAddress);
//   const formattedHistory = convertArrayToObjects(jsonResponseHistory);

//   const jsonResponseRequests = await contract.getMyRequests(userAddress);
//   console.log(convertDataToArrayOfObjects(jsonResponseRequests));

//   const jsonResponse = {
//     name: responseName,
//     balance: jsonResponseBal,
//     dollars: jsonResponseDollars,
//     history: formattedHistory,
//     requests: jsonResponseRequests,
//   };

//   return res.status(200).json(jsonResponse);
// });

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
