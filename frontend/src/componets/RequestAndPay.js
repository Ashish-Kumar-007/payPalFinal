import React, { useState, useEffect } from "react";
import { DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "../abi.json";
import { Web3 } from 'web3';

//private RPC endpoint 
// const web3 = new Web3('https://rpc-mumbai.maticvigil.com'); 

function RequestAndPay({ requests, getNameAndBalance }) {
  console.log(requests)
  const {address} = useAccount();
  const [payModal, setPayModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState();
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [isRequested, setIsRquested]= useState(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);
  const [web3, setWeb3] = useState(null)
  const contractAddr = "0xB45C70ca7f00Aa4c1dE8e9Ba4FBf285105b54Bba"
  // const setupWeb3 = async () => {
  //   const Web3 = require("web3");
  //   if (window.ethereum) {
  //     await window.ethereum.request({ method: "eth_requestAccounts" });
  //   }
  //   return new Web3('https://rpc-mumbai.maticvigil.com');
  // };

  const sendRequest = async () => {
    // const web3 = new Web3(window.ethereum); 
    const contract = new web3.eth.Contract(
      ABI,
      contractAddr
    );
    const requestAmountInWei = web3.utils.toWei(requestAmount.toString(), "ether")
    await contract.methods
      .createRequest(requestAddress, requestAmountInWei, requestMessage)
      .send({
        from: address
      })
      .then(function (receipt) {
        setIsRquested(true)
      });
  };

  const payRequest = async () => {
    // const web3 = new Web3(window.ethereum); 
    const contract = new web3.eth.Contract(
      ABI,
      contractAddr
    );
    const requests = await contract.methods.getMyRequests(address).call();
    console.log(requests)
      console.log(requests)
    await contract.methods
      .payRequest(0)
      .send({
        from: address,
        value: requests[1][0]
      })
      .then(function (receipt) {
        setIsRequestSuccess(true)
      });
  };

  useEffect(() => {
    if(window && window.ethereum){
      setWeb3(new Web3(window.ethereum))
    }
  },[])

  // const { config } = usePrepareContractWrite({
  //   chainId: polygonMumbai.id,
  //   address: "0x61E05990393693287D829363e2271D370b5F8af3",
  //   abi: ABI,
  //   functionName: "payRequest",
  //   args: [0],
  //   overrides: {
  //     value: String(Number(requests["1"][0] * 1e18)),
  //   },
  // });

  // const { write, data } = useContractWrite(config);

  // const { config: configRequest } = usePrepareContractWrite({
  //   chainId: polygonMumbai.id,
  //   address: "0x61E05990393693287D829363e2271D370b5F8af3",
  //   abi: ABI,
  //   functionName: "createRequest",
  //   args: [requestAddress, requestAmount, requestMessage],
  // });

  // const { write: writeRequest, data: dataRequest } =
  //   useContractWrite(configRequest);

  // const { isSuccess } = useWaitForTransaction({
  //   hash: data?.hash,
  // });

  // const { isSuccess: isSuccessRequest } = useWaitForTransaction({
  //   hash: dataRequest?.hash,
  // });

  const showPayModal = () => {
    setPayModal(true);
  };
  const hidePayModal = () => {
    setPayModal(false);
  };

  const showRequestModal = () => {
    setRequestModal(true);
  };
  const hideRequestModal = () => {
    setRequestModal(false);
  };

  useEffect(() => {
    if (isRequestSuccess || isRequested) {
      getNameAndBalance();
    }
  }, [isRequestSuccess, isRequested]);

  return (
    <>
      <Modal
        title="Confirm Payment"
        open={payModal}
        onOk={() => {
          payRequest?.();
          hidePayModal();
        }}
        onCancel={hidePayModal}
        okText="Proceed To Pay"
        cancelText="Cancel"
      >
        {requests && requests["0"]?.length > 0 && (
          <>
            <h2>Sending payment to {requests["3"][0]}</h2>
            <h3>Value: {web3.utils.fromWei(requests["1"][0], "ether")} Matic</h3>
            <p>"{requests["2"][0]}"</p>
          </>
        )}
      </Modal>
      <Modal
        title="Request A Payment"
        open={requestModal}
        onOk={() => {
          sendRequest?.();
          hideRequestModal();
        }}
        onCancel={hideRequestModal}
        okText="Proceed To Request"
        cancelText="Cancel"
      >
        <p>Amount (Ether)</p>
        <InputNumber
          value={requestAmount}
          onChange={(val) => setRequestAmount(val)}
        />
        <p>From (address)</p>
        <Input
          placeholder="0x..."
          value={requestAddress}
          onChange={(val) => setRequestAddress(val.target.value)}
        />
        <p>Message</p>
        <Input
          placeholder="Lunch Bill..."
          value={requestMessage}
          onChange={(val) => setRequestMessage(val.target.value)}
        />
      </Modal>
      <div className="requestAndPay">
        <div
          className="quickOption"
          onClick={() => {
            showPayModal();
          }}
        >
          <DollarOutlined style={{ fontSize: "26px" }} />
          Pay
          {requests && requests["0"]?.length > 0 && (
            <div className="numReqs">{requests["0"].length}</div>
          )}
        </div>
        <div
          className="quickOption"
          onClick={() => {
            showRequestModal();
          }}
        >
          <SwapOutlined style={{ fontSize: "26px" }} />
          Request
        </div>
      </div>
    </>
  );
}

export default RequestAndPay;
